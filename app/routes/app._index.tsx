import { useMemo, useState, type CSSProperties } from "react";
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

import type {
  ProductImportResult,
  ProductSnapshot,
  ProductVariantSnapshot,
} from "../lib/shopify/product-import.server";
import {
  runCatalogScan,
  type CatalogScanResult,
} from "../lib/scanner/run-scan.server";
import type {
  IssueRuleId,
  ProductIssue,
  ScanSummary,
} from "../lib/scanner/types";
import { authenticate } from "../shopify.server";

type ProductDebugRow = {
  productId: string;
  productTitle: string;
  productHandle: string;
  productVendor: string;
  productStatus: string;
  featuredImageUrl: string | null;
  productDescriptionLength: number;
  productCategoryFullName: string | null;
  variantId: string;
  variantTitle: string;
  variantSku: string | null;
  variantBarcode: string | null;
  variantPrice: string;
  issueTitle: string | null;
  issueSeverity: ProductIssue["severity"] | null;
  issueCount: number;
};

type IssueExample = {
  id: string;
  productTitle: string;
  productHandle: string;
  variantTitle: string | null;
};

type IssueGroup = {
  ruleId: ProductIssue["ruleId"];
  title: string;
  severity: ProductIssue["severity"];
  issueCount: number;
  affectedProductCount: number;
  affectedVariantCount: number;
  suggestedFix: string;
  examples: IssueExample[];
};

type ScanActionResponse =
  | {
      status: "success";
      message: string;
      importedAt: string;
      productCount: number;
      variantCount: number;
      hasMoreVariants: boolean;
      maxVariants: number;
      summary: ScanSummary;
      issues: ProductIssue[];
      debugRows: ProductDebugRow[];
    }
  | {
      status: "error";
      message: string;
    };

type HealthTone = "critical" | "warning" | "success" | "neutral" | "info";

type CatalogFilter =
  | "issues"
  | "critical"
  | "warning"
  | "clear"
  | "active"
  | "all";

type IssueDebugDetails = {
  titles: string[];
  highestSeverity: ProductIssue["severity"] | null;
};

type ActionPlanStep = {
  ruleId: IssueRuleId;
  title: string;
  tone: HealthTone;
  issueCount: number;
  affectedProductCount: number;
  affectedVariantCount: number;
  action: string;
  why: string;
  doneWhen: string;
};

type StoreHealth = {
  tone: HealthTone;
  label: string;
  headline: string;
  nextAction: string;
};

type IssueSummaryCard = {
  ruleId: IssueRuleId;
  label: string;
  count: number;
  severity: ProductIssue["severity"];
  whyItMatters: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({
  request,
}: ActionFunctionArgs): Promise<ScanActionResponse> => {
  const { admin } = await authenticate.admin(request);

  try {
    const scanResult: CatalogScanResult = await runCatalogScan(admin, {
      maxVariants: 100,
    });
    const issueDetailsByProductAndVariant =
      buildIssueDetailsByProductAndVariant(scanResult.issues);

    return {
      status: "success",
      message: scanResult.hasMoreVariants
        ? `Imported the first ${scanResult.variantCount} variants and found ${scanResult.summary.totalIssues} issue(s). More variants exist and will be handled by a full background scan later.`
        : `Imported ${scanResult.variantCount} variants and found ${scanResult.summary.totalIssues} issue(s).`,
      importedAt: new Date().toISOString(),
      productCount: scanResult.productCount,
      variantCount: scanResult.variantCount,
      hasMoreVariants: scanResult.hasMoreVariants,
      maxVariants: scanResult.maxVariants,
      summary: scanResult.summary,
      issues: scanResult.issues,
      debugRows: buildDebugRows(scanResult, issueDetailsByProductAndVariant),
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown product scan error.";

    return {
      status: "error",
      message,
    };
  }
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>("issues");

  const scanResult = fetcher.data;
  const isScanning =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const importedProductCount =
    scanResult?.status === "success" ? scanResult.productCount : 0;

  const importedVariantCount =
    scanResult?.status === "success" ? scanResult.variantCount : 0;

  const productRows: ProductDebugRow[] =
    scanResult?.status === "success" ? scanResult.debugRows : [];

  const issueGroups: IssueGroup[] =
    scanResult?.status === "success" ? buildIssueGroups(scanResult.issues) : [];

  const summary: ScanSummary | null =
    scanResult?.status === "success" ? scanResult.summary : null;
  const readinessScore = summary
    ? `${summary.readinessScore} / 100`
    : "-- / 100";
  const health = getStoreHealth(summary, scanResult, isScanning);
  const issueSummaryCards = summary ? buildIssueSummaryCards(summary) : [];
  const actionPlanSteps =
    scanResult?.status === "success" ? buildActionPlanSteps(issueGroups) : [];
  const filteredProductRows = useMemo(
    () => filterCatalogRows(productRows, catalogFilter),
    [productRows, catalogFilter],
  );
  const catalogFilterCounts = useMemo(
    () => buildCatalogFilterCounts(productRows),
    [productRows],
  );

  const runScan = () => {
    fetcher.submit({}, { method: "POST" });
  };

  return (
    <>
      <style>{skeletonStyles}</style>

      <s-page heading="MerchantFix">
        <s-button
          slot="primary-action"
          onClick={runScan}
          {...(isScanning ? { loading: true } : {})}
        >
          Run scan
        </s-button>

        <s-section heading="Google Shopping readiness scanner">
          <s-stack direction="block" gap="base">
            <s-paragraph>
              MerchantFix scans active Shopify products for catalog issues that
              can block or weaken Google Shopping performance. Run a scan, fix
              red items first, then clean up yellow warnings.
            </s-paragraph>
          </s-stack>
        </s-section>

        <s-section heading="Store health">
          {isScanning ? (
            <SkeletonDashboard />
          ) : (
            <s-stack direction="block" gap="base">
              <div style={getHeroCardStyle(health.tone)}>
                <div style={heroTopRowStyle}>
                  <div>
                    <div style={getStatusPillStyle(health.tone)}>
                      {health.label}
                    </div>
                    <h2 style={heroScoreStyle}>{readinessScore}</h2>
                    <p style={heroHeadlineStyle}>{health.headline}</p>
                  </div>

                  <div style={heroMetaGridStyle}>
                    <MetricTile
                      label="Total issues"
                      value={summary?.totalIssues ?? 0}
                      tone={
                        summary && summary.totalIssues > 0
                          ? "warning"
                          : "success"
                      }
                    />
                    <MetricTile
                      label="Critical"
                      value={summary?.criticalIssues ?? 0}
                      tone={
                        summary && summary.criticalIssues > 0
                          ? "critical"
                          : "success"
                      }
                    />
                    <MetricTile
                      label="Affected products"
                      value={summary?.affectedProducts ?? 0}
                      tone={
                        summary && summary.affectedProducts > 0
                          ? "warning"
                          : "success"
                      }
                    />
                  </div>
                </div>

                <div style={nextActionStyle}>
                  <strong>Next best action:</strong> {health.nextAction}
                </div>
              </div>

              <div style={scanStatusCardStyle}>
                <s-stack direction="block" gap="small">
                  <s-heading>{getScanStatusHeading(scanResult)}</s-heading>
                  <s-paragraph>
                    {scanResult?.message ||
                      "Click Run scan to fetch products and variants from Shopify."}
                  </s-paragraph>

                  {scanResult?.status === "success" && (
                    <s-paragraph>
                      Last scanned at:{" "}
                      {new Date(scanResult.importedAt).toLocaleString()}
                    </s-paragraph>
                  )}

                  {scanResult?.status === "error" && (
                    <s-paragraph>
                      Check your Shopify dev preview, app scopes, and terminal
                      output, then run the scan again.
                    </s-paragraph>
                  )}
                </s-stack>
              </div>
            </s-stack>
          )}
        </s-section>

        <s-section heading="Fix order">
          {isScanning ? (
            <SkeletonGrid />
          ) : scanResult?.status === "success" && actionPlanSteps.length > 0 ? (
            <s-stack direction="block" gap="base">
              <s-paragraph>
                Start here. These steps are ordered by merchant impact: red
                blockers first, then yellow cleanup with the largest catalog
                reach.
              </s-paragraph>

              <div style={actionPlanGridStyle}>
                {actionPlanSteps.map((step, index) => (
                  <ActionPlanStepCard
                    key={step.ruleId}
                    step={step}
                    stepNumber={index + 1}
                  />
                ))}
              </div>
            </s-stack>
          ) : scanResult?.status === "success" ? (
            <div style={getToneCardStyle("success")}>
              <s-heading>No fixes needed from current rules</s-heading>
              <s-paragraph>
                The current deterministic checks did not find catalog issues.
              </s-paragraph>
            </div>
          ) : scanResult?.status === "error" ? (
            <div style={getToneCardStyle("critical")}>
              <s-heading>Scan failed</s-heading>
              <s-paragraph>{scanResult.message}</s-paragraph>
            </div>
          ) : (
            <div style={getToneCardStyle("neutral")}>
              <s-heading>No scan yet</s-heading>
              <s-paragraph>
                Run a scan to get a simple ordered action plan.
              </s-paragraph>
            </div>
          )}
        </s-section>

        <s-section heading="Issue summary">
          {isScanning ? (
            <SkeletonGrid />
          ) : (
            <s-stack direction="block" gap="base">
              {issueSummaryCards.length > 0 ? (
                <div style={issueGridStyle}>
                  {issueSummaryCards.map((card) => (
                    <IssueCard key={card.ruleId} card={card} />
                  ))}
                </div>
              ) : (
                <div style={getToneCardStyle("neutral")}>
                  <s-heading>Waiting for scan</s-heading>
                  <s-paragraph>
                    The issue summary will appear here after the first catalog
                    scan.
                  </s-paragraph>
                </div>
              )}

              <div style={compactMetricsGridStyle}>
                <MetricTile
                  label="Imported products"
                  value={importedProductCount}
                  tone="neutral"
                />
                <MetricTile
                  label="Imported variants"
                  value={importedVariantCount}
                  tone="neutral"
                />
                <MetricTile
                  label="Active variants scanned"
                  value={summary?.scannedVariants ?? 0}
                  tone="neutral"
                />
                <MetricTile
                  label="More variants after limit"
                  value={
                    scanResult?.status === "success" &&
                    scanResult.hasMoreVariants
                      ? "Yes"
                      : "No"
                  }
                  tone={
                    scanResult?.status === "success" &&
                    scanResult.hasMoreVariants
                      ? "warning"
                      : "success"
                  }
                />
              </div>

              <div style={getToneCardStyle("info")}>
                <s-paragraph>
                  This development scan reads up to 100 variants so the embedded
                  dashboard stays fast. Draft and archived products are visible
                  in the table, but only active products affect the score.
                </s-paragraph>
              </div>
            </s-stack>
          )}
        </s-section>

        <s-section heading="Detailed fix checklist">
          <s-stack direction="block" gap="base">
            <div style={getToneCardStyle("info")}>
              <s-paragraph>
                These fixes are deterministic, not AI-generated. Start with red
                critical items, then work through yellow warnings.
              </s-paragraph>
            </div>

            {scanResult?.status === "success" && issueGroups.length > 0 ? (
              issueGroups.map((group) => (
                <div key={group.ruleId} style={getIssueGroupCardStyle(group)}>
                  <s-stack direction="block" gap="small">
                    <div style={issueGroupHeaderStyle}>
                      <s-heading>{group.title}</s-heading>
                      <span
                        style={getStatusPillStyle(getIssueGroupTone(group))}
                      >
                        {group.severity}
                      </span>
                    </div>

                    <s-paragraph>{formatIssueGroupMeta(group)}</s-paragraph>
                    <s-paragraph>
                      <strong>Suggested fix:</strong> {group.suggestedFix}
                    </s-paragraph>

                    <s-heading>Affected examples</s-heading>
                    <s-unordered-list>
                      {group.examples.map((example) => (
                        <s-list-item key={example.id}>
                          {formatIssueExample(example)}
                        </s-list-item>
                      ))}
                    </s-unordered-list>

                    {group.issueCount > group.examples.length && (
                      <s-paragraph>
                        Showing first {group.examples.length} of{" "}
                        {group.issueCount} issue(s) for this check.
                      </s-paragraph>
                    )}
                  </s-stack>
                </div>
              ))
            ) : scanResult?.status === "success" ? (
              <div style={getToneCardStyle("success")}>
                <s-paragraph>
                  No issues found in the current debug scan. Add more scanner
                  rules to broaden coverage.
                </s-paragraph>
              </div>
            ) : (
              <div style={getToneCardStyle("neutral")}>
                <s-paragraph>
                  Run a scan to generate a rule-based fix checklist for the
                  imported catalog.
                </s-paragraph>
              </div>
            )}
          </s-stack>
        </s-section>

        <s-section heading="Catalog details">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack direction="block" gap="base">
              <s-paragraph>
                Use this table when you need to verify the exact product or
                variant behind a summary card. It is intentionally lower on the
                page so the first screen stays action-focused.
              </s-paragraph>

              {productRows.length > 0 && (
                <CatalogFilterBar
                  activeFilter={catalogFilter}
                  counts={catalogFilterCounts}
                  onChange={setCatalogFilter}
                />
              )}

              {productRows.length > 0 && (
                <s-paragraph>
                  Showing {filteredProductRows.length} of {productRows.length}{" "}
                  catalog row(s).
                </s-paragraph>
              )}

              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>Product</th>
                      <th style={tableHeaderStyle}>Status</th>
                      <th style={tableHeaderStyle}>Issue</th>
                      <th style={tableHeaderStyle}>Category</th>
                      <th style={tableHeaderStyle}>Description</th>
                      <th style={tableHeaderStyle}>Variant</th>
                      <th style={tableHeaderStyle}>Barcode / GTIN</th>
                      <th style={tableHeaderStyle}>Image</th>
                      <th style={tableHeaderStyle}>Vendor</th>
                      <th style={tableHeaderStyle}>SKU</th>
                      <th style={tableHeaderStyle}>Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProductRows.length > 0 ? (
                      filteredProductRows.map((row) => (
                        <tr key={row.variantId}>
                          <td style={tableCellStyle}>
                            {row.productTitle}
                            <br />
                            <small>{row.productHandle}</small>
                          </td>
                          <td style={tableCellStyle}>{row.productStatus}</td>
                          <td style={tableCellStyle}>
                            {row.issueTitle ? (
                              <span
                                style={getIssueTextStyle(row.issueSeverity)}
                              >
                                {row.issueTitle}
                              </span>
                            ) : (
                              <span style={clearIssueTextStyle}>No issue</span>
                            )}
                          </td>
                          <td style={tableCellStyle}>
                            {row.productCategoryFullName || "Missing"}
                          </td>
                          <td style={tableCellStyle}>
                            {row.productDescriptionLength} characters
                          </td>
                          <td style={tableCellStyle}>{row.variantTitle}</td>
                          <td style={tableCellStyle}>
                            {row.variantBarcode || "Missing"}
                          </td>
                          <td style={tableCellStyle}>
                            {row.featuredImageUrl ? "Present" : "Missing"}
                          </td>
                          <td style={tableCellStyle}>
                            {row.productVendor || "—"}
                          </td>
                          <td style={tableCellStyle}>
                            {row.variantSku || "—"}
                          </td>
                          <td style={tableCellStyle}>{row.variantPrice}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={tableCellStyle} colSpan={11}>
                          {productRows.length === 0
                            ? "No product data imported yet. Click Run scan to fetch product variants from Shopify."
                            : "No catalog rows match the selected filter."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </s-stack>
          </s-box>
        </s-section>

        <s-section slot="aside" heading="Color guide">
          <s-unordered-list>
            <s-list-item>Red = fix first, likely blocker</s-list-item>
            <s-list-item>Yellow = cleanup, quality risk</s-list-item>
            <s-list-item>Green = currently clear</s-list-item>
            <s-list-item>Blue = informational context</s-list-item>
          </s-unordered-list>
        </s-section>

        <s-section slot="aside" heading="Next build steps">
          <s-unordered-list>
            <s-list-item>Improve product-level issue grouping</s-list-item>
            <s-list-item>Add product-level drilldown</s-list-item>
            <s-list-item>Refine readiness score weighting</s-list-item>
            <s-list-item>Add report preview / CSV export later</s-list-item>
          </s-unordered-list>
        </s-section>
      </s-page>
    </>
  );
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: HealthTone;
}) {
  return (
    <div style={getMetricTileStyle(tone)}>
      <div style={metricValueStyle}>{value}</div>
      <div style={metricLabelStyle}>{label}</div>
    </div>
  );
}

function ActionPlanStepCard({
  step,
  stepNumber,
}: {
  step: ActionPlanStep;
  stepNumber: number;
}) {
  return (
    <div style={getToneCardStyle(step.tone)}>
      <div style={actionPlanHeaderStyle}>
        <div style={actionPlanNumberStyle}>{stepNumber}</div>
        <span style={getStatusPillStyle(step.tone)}>
          {step.tone === "critical" ? "Fix first" : "Cleanup"}
        </span>
      </div>

      <s-heading>{step.title}</s-heading>
      <p style={priorityCountStyle}>
        {step.issueCount} issue(s) • {step.affectedProductCount} product(s)
        {step.affectedVariantCount > 0
          ? ` • ${step.affectedVariantCount} variant(s)`
          : ""}
      </p>
      <p style={compactParagraphStyle}>
        <strong>Action:</strong> {step.action}
      </p>
      <p style={compactParagraphStyle}>
        <strong>Why:</strong> {step.why}
      </p>
      <p style={doneWhenStyle}>
        <strong>Done when:</strong> {step.doneWhen}
      </p>
    </div>
  );
}

function CatalogFilterBar({
  activeFilter,
  counts,
  onChange,
}: {
  activeFilter: CatalogFilter;
  counts: Record<CatalogFilter, number>;
  onChange: (filter: CatalogFilter) => void;
}) {
  const filters: CatalogFilter[] = [
    "issues",
    "critical",
    "warning",
    "clear",
    "active",
    "all",
  ];

  return (
    <div style={filterBarStyle}>
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          style={getFilterButtonStyle(activeFilter === filter)}
          onClick={() => onChange(filter)}
        >
          {getCatalogFilterLabel(filter)} ({counts[filter]})
        </button>
      ))}
    </div>
  );
}

function IssueCard({ card }: { card: IssueSummaryCard }) {
  const hasIssues = card.count > 0;
  const tone: HealthTone = hasIssues
    ? card.severity === "critical"
      ? "critical"
      : "warning"
    : "success";

  return (
    <div style={getToneCardStyle(tone)}>
      <div style={issueCardTopRowStyle}>
        <div style={issueCountStyle}>{card.count}</div>
        <span style={getStatusPillStyle(tone)}>
          {hasIssues ? "Fix" : "Clear"}
        </span>
      </div>
      <s-heading>{card.label}</s-heading>
      <p style={compactParagraphStyle}>{card.whyItMatters}</p>
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <s-stack direction="block" gap="base">
      <div style={getToneCardStyle("neutral")}>
        <div className="merchantfix-skeleton merchantfix-skeleton-wide" />
        <div className="merchantfix-skeleton merchantfix-skeleton-score" />
        <div className="merchantfix-skeleton merchantfix-skeleton-line" />
        <div className="merchantfix-skeleton merchantfix-skeleton-line-short" />
      </div>
      <SkeletonGrid />
    </s-stack>
  );
}

function SkeletonGrid() {
  return (
    <div style={issueGridStyle}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} style={getToneCardStyle("neutral")}>
          <div className="merchantfix-skeleton merchantfix-skeleton-line-short" />
          <div className="merchantfix-skeleton merchantfix-skeleton-line" />
          <div className="merchantfix-skeleton merchantfix-skeleton-line" />
        </div>
      ))}
    </div>
  );
}

function buildDebugRows(
  scanResult: ProductImportResult,
  issueDetailsByProductAndVariant: Map<string, IssueDebugDetails>,
): ProductDebugRow[] {
  return scanResult.products.flatMap((product: ProductSnapshot) =>
    product.variants.map((variant: ProductVariantSnapshot): ProductDebugRow => {
      const productIssueDetails = issueDetailsByProductAndVariant.get(
        product.id,
      );
      const variantIssueDetails = issueDetailsByProductAndVariant.get(
        variant.id,
      );
      const issueTitles = [
        ...(productIssueDetails?.titles ?? []),
        ...(variantIssueDetails?.titles ?? []),
      ];
      const issueSeverity = getHighestIssueSeverity([
        productIssueDetails?.highestSeverity ?? null,
        variantIssueDetails?.highestSeverity ?? null,
      ]);

      return {
        productId: product.id,
        productTitle: product.title,
        productHandle: product.handle,
        productVendor: product.vendor,
        productStatus: product.status,
        featuredImageUrl: product.featuredImageUrl,
        productDescriptionLength: product.description.trim().length,
        productCategoryFullName: product.categoryFullName,
        variantId: variant.id,
        variantTitle: variant.title,
        variantSku: variant.sku,
        variantBarcode: variant.barcode,
        variantPrice: variant.price,
        issueTitle: issueTitles.length > 0 ? issueTitles.join(", ") : null,
        issueSeverity,
        issueCount: issueTitles.length,
      };
    }),
  );
}

function buildIssueDetailsByProductAndVariant(
  issues: ProductIssue[],
): Map<string, IssueDebugDetails> {
  const issueDetailsByProductAndVariant = new Map<string, IssueDebugDetails>();

  for (const issue of issues) {
    const key = issue.variantId ?? issue.productId;
    const issueDetails = issueDetailsByProductAndVariant.get(key) ?? {
      titles: [],
      highestSeverity: null,
    };

    issueDetails.titles.push(issue.title);
    issueDetails.highestSeverity = getHighestIssueSeverity([
      issueDetails.highestSeverity,
      issue.severity,
    ]);
    issueDetailsByProductAndVariant.set(key, issueDetails);
  }

  return issueDetailsByProductAndVariant;
}

function buildIssueGroups(issues: ProductIssue[]): IssueGroup[] {
  const issuesByRuleId = new Map<ProductIssue["ruleId"], ProductIssue[]>();

  for (const issue of issues) {
    const groupIssues = issuesByRuleId.get(issue.ruleId) ?? [];

    groupIssues.push(issue);
    issuesByRuleId.set(issue.ruleId, groupIssues);
  }

  return Array.from(issuesByRuleId.entries()).map(([ruleId, groupIssues]) => {
    const firstIssue = groupIssues[0];

    if (!firstIssue) {
      throw new Error(`Cannot build issue group for ${ruleId} without issues.`);
    }

    const affectedProductIds = new Set(
      groupIssues.map((issue) => issue.productId),
    );
    const affectedVariantIds = new Set(
      groupIssues
        .map((issue) => issue.variantId)
        .filter((variantId): variantId is string => Boolean(variantId)),
    );

    return {
      ruleId,
      title: firstIssue.title,
      severity: firstIssue.severity,
      issueCount: groupIssues.length,
      affectedProductCount: affectedProductIds.size,
      affectedVariantCount: affectedVariantIds.size,
      suggestedFix: firstIssue.suggestedFix,
      examples: groupIssues.slice(0, 5).map(
        (issue): IssueExample => ({
          id: issue.id,
          productTitle: issue.productTitle,
          productHandle: issue.productHandle,
          variantTitle: issue.variantTitle,
        }),
      ),
    };
  });
}

function buildIssueSummaryCards(summary: ScanSummary): IssueSummaryCard[] {
  return [
    {
      ruleId: "missing_barcode_gtin",
      label: "Missing barcode / GTIN",
      count: summary.missingBarcodeIssues,
      severity: "critical",
      whyItMatters:
        "Product identifiers are high-priority feed readiness data.",
    },
    {
      ruleId: "missing_product_image",
      label: "Missing product image",
      count: summary.missingImageIssues,
      severity: "critical",
      whyItMatters:
        "Listings need a clear product image before shoppers can trust them.",
    },
    {
      ruleId: "missing_product_category",
      label: "Missing product category",
      count: summary.missingCategoryIssues,
      severity: "warning",
      whyItMatters:
        "Categories help classify products and improve listing quality.",
    },
    {
      ruleId: "short_product_description",
      label: "Short product description",
      count: summary.shortDescriptionIssues,
      severity: "warning",
      whyItMatters:
        "Thin descriptions give Google and shoppers less useful context.",
    },
    {
      ruleId: "short_product_title",
      label: "Short product title",
      count: summary.shortTitleIssues,
      severity: "warning",
      whyItMatters:
        "Titles should clearly explain the product type and key details.",
    },
    {
      ruleId: "missing_vendor_brand",
      label: "Missing vendor / brand",
      count: summary.missingVendorIssues,
      severity: "warning",
      whyItMatters: "Brand or vendor data helps make listings more complete.",
    },
    {
      ruleId: "duplicate_product_title",
      label: "Duplicate product title",
      count: summary.duplicateTitleIssues,
      severity: "warning",
      whyItMatters:
        "Duplicate titles make catalog review and listing quality weaker.",
    },
  ];
}

function buildActionPlanSteps(issueGroups: IssueGroup[]): ActionPlanStep[] {
  return issueGroups
    .map((group): ActionPlanStep => {
      const actionCopy = getRuleActionCopy(group.ruleId);

      return {
        ruleId: group.ruleId,
        title: group.title,
        tone: getIssueGroupTone(group),
        issueCount: group.issueCount,
        affectedProductCount: group.affectedProductCount,
        affectedVariantCount: group.affectedVariantCount,
        action: actionCopy.action,
        why: actionCopy.why,
        doneWhen: actionCopy.doneWhen,
      };
    })
    .sort((left, right) => {
      const priorityDelta =
        getRulePriority(right.ruleId) - getRulePriority(left.ruleId);

      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return right.issueCount - left.issueCount;
    })
    .slice(0, 5);
}

function getRulePriority(ruleId: IssueRuleId): number {
  switch (ruleId) {
    case "missing_barcode_gtin":
      return 100;
    case "missing_product_image":
      return 90;
    case "missing_product_category":
      return 70;
    case "short_product_description":
      return 60;
    case "short_product_title":
      return 50;
    case "missing_vendor_brand":
      return 40;
    case "duplicate_product_title":
      return 30;
    default:
      return 0;
  }
}

function getRuleActionCopy(ruleId: IssueRuleId): {
  action: string;
  why: string;
  doneWhen: string;
} {
  switch (ruleId) {
    case "missing_barcode_gtin":
      return {
        action:
          "Open the affected variants in Shopify and add valid barcode / GTIN values where available.",
        why: "Identifiers are one of the clearest product data signals and should be fixed before content polish.",
        doneWhen:
          "The missing barcode / GTIN card reaches 0, or custom/no-GTIN exceptions are documented later.",
      };
    case "missing_product_image":
      return {
        action: "Add a clear featured image to every affected active product.",
        why: "A product without a main image is a high-friction shopping experience and should not be buried in cleanup work.",
        doneWhen: "Every active product row shows Image = Present.",
      };
    case "missing_product_category":
      return {
        action:
          "Assign the most specific Shopify product category that matches each affected product.",
        why: "Categories help classify products and make the catalog easier to review at a glance.",
        doneWhen:
          "The Category column no longer says Missing for active products.",
      };
    case "short_product_description":
      return {
        action:
          "Expand thin descriptions with product type, benefits, materials, sizing, compatibility, and use cases.",
        why: "Thin descriptions give shoppers and Google less context, especially when many products are affected.",
        doneWhen:
          "Affected active products have descriptions above the current threshold.",
      };
    case "short_product_title":
      return {
        action:
          "Rewrite short titles so they include product type and useful distinguishing details.",
        why: "Short titles can be unclear when products appear outside the storefront context.",
        doneWhen: "No active products are flagged by the short title rule.",
      };
    case "missing_vendor_brand":
      return {
        action:
          "Add vendor or brand values to affected products where the data is known.",
        why: "Brand/vendor data improves catalog completeness and makes products easier to audit.",
        doneWhen: "The missing vendor / brand card reaches 0.",
      };
    case "duplicate_product_title":
      return {
        action:
          "Rename duplicate titles with model, size, color, material, or other real distinguishing details.",
        why: "Unique titles help merchants, shoppers, and downstream feeds distinguish similar products.",
        doneWhen: "The duplicate product title card reaches 0.",
      };
    default:
      return {
        action: "Review the affected products and apply the suggested fix.",
        why: "This issue affects catalog readiness.",
        doneWhen: "The issue count reaches 0 for this rule.",
      };
  }
}

function filterCatalogRows(
  rows: ProductDebugRow[],
  filter: CatalogFilter,
): ProductDebugRow[] {
  switch (filter) {
    case "issues":
      return rows.filter((row) => row.issueCount > 0);
    case "critical":
      return rows.filter((row) => row.issueSeverity === "critical");
    case "warning":
      return rows.filter((row) => row.issueSeverity === "warning");
    case "clear":
      return rows.filter((row) => row.issueCount === 0);
    case "active":
      return rows.filter((row) => row.productStatus === "ACTIVE");
    case "all":
    default:
      return rows;
  }
}

function buildCatalogFilterCounts(
  rows: ProductDebugRow[],
): Record<CatalogFilter, number> {
  return {
    issues: rows.filter((row) => row.issueCount > 0).length,
    critical: rows.filter((row) => row.issueSeverity === "critical").length,
    warning: rows.filter((row) => row.issueSeverity === "warning").length,
    clear: rows.filter((row) => row.issueCount === 0).length,
    active: rows.filter((row) => row.productStatus === "ACTIVE").length,
    all: rows.length,
  };
}

function getCatalogFilterLabel(filter: CatalogFilter): string {
  switch (filter) {
    case "issues":
      return "Needs fixes";
    case "critical":
      return "Critical";
    case "warning":
      return "Warnings";
    case "clear":
      return "Clear";
    case "active":
      return "Active";
    case "all":
      return "All";
    default:
      return "Filter";
  }
}

function getHighestIssueSeverity(
  severities: Array<ProductIssue["severity"] | null>,
): ProductIssue["severity"] | null {
  if (severities.includes("critical")) {
    return "critical";
  }

  if (severities.includes("warning")) {
    return "warning";
  }

  return null;
}

function getStoreHealth(
  summary: ScanSummary | null,
  scanResult: ScanActionResponse | undefined,
  isScanning: boolean,
): StoreHealth {
  if (isScanning) {
    return {
      tone: "info",
      label: "Scanning",
      headline: "Checking the catalog now.",
      nextAction: "Wait for the scan to finish before making changes.",
    };
  }

  if (scanResult?.status === "error") {
    return {
      tone: "critical",
      label: "Scan failed",
      headline: "MerchantFix could not complete the catalog scan.",
      nextAction: "Fix the scan error first, then run the scan again.",
    };
  }

  if (!summary) {
    return {
      tone: "neutral",
      label: "No scan yet",
      headline: "Run a scan to see store readiness.",
      nextAction: "Click Run scan to import active products and find issues.",
    };
  }

  if (summary.criticalIssues > 0) {
    return {
      tone: "critical",
      label: "Critical fixes needed",
      headline:
        "Some products have issues that should be fixed before cleanup work.",
      nextAction: "Fix missing barcode / GTIN and missing image issues first.",
    };
  }

  if (summary.readinessScore >= 90) {
    return {
      tone: "success",
      label: "Strong readiness",
      headline: "The scanned catalog looks healthy for the current rule set.",
      nextAction:
        "Review warnings if any remain, then prepare export/report features.",
    };
  }

  if (summary.readinessScore >= 70) {
    return {
      tone: "warning",
      label: "Almost ready",
      headline:
        "No critical blockers, but quality cleanup is still recommended.",
      nextAction:
        "Work through warning cards with the highest affected product count.",
    };
  }

  return {
    tone: "warning",
    label: "Needs cleanup",
    headline: "The store needs catalog cleanup before it looks ready.",
    nextAction: "Start with the largest warning group, then rerun the scan.",
  };
}

function getIssueGroupTone(group: IssueGroup): HealthTone {
  if (group.severity === "critical") {
    return "critical";
  }

  if (group.severity === "warning") {
    return "warning";
  }

  return "info";
}

function getIssueImpactText(ruleId: IssueRuleId): string {
  switch (ruleId) {
    case "missing_barcode_gtin":
      return "High-impact identifier issue. Fix this before polishing lower-risk content.";
    case "missing_product_image":
      return "High-impact trust issue. A listing without an image is hard to sell.";
    case "missing_product_category":
      return "Classification issue. Use specific Shopify product categories where possible.";
    case "short_product_description":
      return "Content depth issue. Give shoppers and Google more useful product context.";
    case "short_product_title":
      return "Content clarity issue. Make the title descriptive without keyword stuffing.";
    case "missing_vendor_brand":
      return "Catalog completeness issue. Add vendor or brand data when available.";
    case "duplicate_product_title":
      return "Catalog clarity issue. Unique titles make products easier to review and distinguish.";
    default:
      return "Catalog readiness issue. Review the affected products and apply the suggested fix.";
  }
}

function formatIssueGroupMeta(group: IssueGroup): string {
  const parts = [
    `${group.issueCount} issue(s)`,
    `${group.severity} severity`,
    `${group.affectedProductCount} affected product(s)`,
  ];

  if (group.affectedVariantCount > 0) {
    parts.push(`${group.affectedVariantCount} affected variant(s)`);
  }

  return parts.join(" • ");
}

function formatIssueExample(example: IssueExample): string {
  const productLabel = `${example.productTitle} (${example.productHandle})`;

  if (!example.variantTitle) {
    return productLabel;
  }

  return `${productLabel} — ${example.variantTitle}`;
}

function getScanStatusHeading(scanResult: ScanActionResponse | undefined) {
  if (!scanResult) {
    return "No scan yet";
  }

  if (scanResult.status === "error") {
    return "Scan failed";
  }

  return "Scan complete";
}

function getToneCardStyle(tone: HealthTone): CSSProperties {
  const colors = toneColorMap[tone];

  return {
    padding: "16px",
    border: `1px solid ${colors.border}`,
    borderLeft: `6px solid ${colors.accent}`,
    borderRadius: "12px",
    background: colors.background,
    color: colors.text,
  };
}

function getHeroCardStyle(tone: HealthTone): CSSProperties {
  const colors = toneColorMap[tone];

  return {
    ...getToneCardStyle(tone),
    padding: "24px",
    boxShadow: `0 1px 0 ${colors.border}`,
  };
}

function getIssueGroupCardStyle(group: IssueGroup): CSSProperties {
  return getToneCardStyle(getIssueGroupTone(group));
}

function getMetricTileStyle(tone: HealthTone): CSSProperties {
  const colors = toneColorMap[tone];

  return {
    padding: "14px",
    border: `1px solid ${colors.border}`,
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.72)",
    minWidth: "120px",
  };
}

function getStatusPillStyle(tone: HealthTone): CSSProperties {
  const colors = toneColorMap[tone];

  return {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "4px 10px",
    borderRadius: "999px",
    border: `1px solid ${colors.border}`,
    background: colors.pillBackground,
    color: colors.text,
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.02em",
  };
}

const toneColorMap: Record<
  HealthTone,
  {
    background: string;
    pillBackground: string;
    border: string;
    accent: string;
    text: string;
  }
> = {
  critical: {
    background: "#fff4f4",
    pillBackground: "#ffe2df",
    border: "#e5483f",
    accent: "#d72c0d",
    text: "#5f1508",
  },
  warning: {
    background: "#fff8e6",
    pillBackground: "#ffefb3",
    border: "#d89b00",
    accent: "#b7791f",
    text: "#5c3b00",
  },
  success: {
    background: "#f0fdf4",
    pillBackground: "#dcfce7",
    border: "#22a06b",
    accent: "#168a50",
    text: "#14532d",
  },
  neutral: {
    background: "#f7f7f8",
    pillBackground: "#eeeeef",
    border: "#d7d7db",
    accent: "#6b7280",
    text: "#303030",
  },
  info: {
    background: "#f0f7ff",
    pillBackground: "#dbeafe",
    border: "#5b9bd5",
    accent: "#2563eb",
    text: "#173b74",
  },
};

const heroTopRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1fr) minmax(240px, 420px)",
  gap: "20px",
  alignItems: "start",
};

const heroScoreStyle: CSSProperties = {
  margin: "12px 0 6px",
  fontSize: "44px",
  lineHeight: 1,
};

const heroHeadlineStyle: CSSProperties = {
  margin: 0,
  fontSize: "16px",
};

const heroMetaGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "12px",
};

const nextActionStyle: CSSProperties = {
  marginTop: "18px",
  padding: "14px",
  borderRadius: "10px",
  background: "rgba(255, 255, 255, 0.76)",
};

const scanStatusCardStyle: CSSProperties = {
  padding: "16px",
  border: "1px solid #d7d7db",
  borderRadius: "12px",
  background: "#ffffff",
};

const issueGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "12px",
};

const actionPlanGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "12px",
};

const compactMetricsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "12px",
};

const metricValueStyle: CSSProperties = {
  fontSize: "26px",
  lineHeight: 1.1,
  fontWeight: 800,
};

const metricLabelStyle: CSSProperties = {
  marginTop: "6px",
  fontSize: "13px",
};

const issueCardTopRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  marginBottom: "10px",
};

const issueCountStyle: CSSProperties = {
  fontSize: "32px",
  lineHeight: 1,
  fontWeight: 800,
};

const actionPlanHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "12px",
};

const actionPlanNumberStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "34px",
  height: "34px",
  borderRadius: "999px",
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(0, 0, 0, 0.12)",
  fontWeight: 800,
};

const priorityCountStyle: CSSProperties = {
  margin: "10px 0",
  fontSize: "15px",
  fontWeight: 700,
};

const compactParagraphStyle: CSSProperties = {
  margin: "8px 0 0",
};

const doneWhenStyle: CSSProperties = {
  margin: "12px 0 0",
  padding: "10px",
  borderRadius: "8px",
  background: "rgba(255, 255, 255, 0.72)",
};

const issueGroupHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
};

const tableHeaderStyle: CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  whiteSpace: "nowrap",
};

const tableCellStyle: CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #eee",
  verticalAlign: "top",
};

function getIssueTextStyle(
  severity: ProductIssue["severity"] | null,
): CSSProperties {
  return {
    fontWeight: 800,
    color: severity === "critical" ? "#8a1f11" : "#6f4e00",
  };
}

function getFilterButtonStyle(isActive: boolean): CSSProperties {
  return {
    border: isActive ? "1px solid #303030" : "1px solid #d7d7db",
    borderRadius: "999px",
    background: isActive ? "#303030" : "#ffffff",
    color: isActive ? "#ffffff" : "#303030",
    padding: "8px 12px",
    fontWeight: 700,
    cursor: "pointer",
  };
}

const clearIssueTextStyle: CSSProperties = {
  color: "#168a50",
  fontWeight: 700,
};

const filterBarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const skeletonStyles = `
  @keyframes merchantfix-skeleton-pulse {
    0% { opacity: 0.45; }
    50% { opacity: 1; }
    100% { opacity: 0.45; }
  }

  .merchantfix-skeleton {
    display: block;
    background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
    background-size: 400% 100%;
    border-radius: 8px;
    animation: merchantfix-skeleton-pulse 1.2s ease-in-out infinite;
  }

  .merchantfix-skeleton-wide {
    width: 220px;
    height: 22px;
    margin-bottom: 16px;
  }

  .merchantfix-skeleton-score {
    width: 160px;
    height: 48px;
    margin-bottom: 16px;
  }

  .merchantfix-skeleton-line {
    width: 100%;
    height: 16px;
    margin-bottom: 10px;
  }

  .merchantfix-skeleton-line-short {
    width: 62%;
    height: 16px;
    margin-bottom: 10px;
  }
`;

export const headers: HeadersFunction = (
  headersArgs: Parameters<HeadersFunction>[0],
) => {
  return boundary.headers(headersArgs);
};
