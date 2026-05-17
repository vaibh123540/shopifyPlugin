import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useFetcher } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { authenticate } from "../shopify.server";

type ScanActionResponse = {
  status: "placeholder";
  message: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<ScanActionResponse> => {
  await authenticate.admin(request);

  return {
    status: "placeholder",
    message:
      "Scanner is not connected yet. Product import and scanner rules will be added in the next phase.",
  };
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();

  const isScanning =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const runScan = () => {
    fetcher.submit({}, { method: "POST" });
  };

  return (
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
            MerchantFix helps Shopify merchants find product catalog issues that
            may affect Google Shopping and Merchant Center readiness.
          </s-paragraph>

          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="small">
              <s-heading>Current phase</s-heading>
              <s-paragraph>
                Dashboard shell is ready. Product import and scanner rules are
                coming next.
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Readiness score">
        <s-stack direction="block" gap="base">
          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
            background="subdued"
          >
            <s-stack direction="block" gap="small">
              <s-heading>-- / 100</s-heading>
              <s-paragraph>
                No scan has been run yet. Once product import is connected, this
                score will show the store&apos;s Google Shopping readiness.
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Scan status">
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack direction="block" gap="small">
              <s-heading>
                {fetcher.data?.status === "placeholder"
                  ? "Scan placeholder triggered"
                  : "No scan yet"}
              </s-heading>

              <s-paragraph>
                {fetcher.data?.message ||
                  "Click Run scan when the scanner is connected. For now, this button only confirms the dashboard action is wired."}
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Issue summary">
        <s-stack direction="block" gap="base">
          <s-box padding="base" borderWidth="base" borderRadius="base">
            <s-stack direction="block" gap="small">
              <s-heading>Coming scanner checks</s-heading>

              <s-unordered-list>
                <s-list-item>Missing barcode / GTIN</s-list-item>
                <s-list-item>Missing vendor / brand</s-list-item>
                <s-list-item>Missing product image</s-list-item>
                <s-list-item>Short product title</s-list-item>
                <s-list-item>Short product description</s-list-item>
                <s-list-item>Duplicate product title</s-list-item>
                <s-list-item>Missing Google product category</s-list-item>
              </s-unordered-list>
            </s-stack>
          </s-box>
        </s-stack>
      </s-section>

      <s-section heading="Product issues">
        <s-box padding="base" borderWidth="base" borderRadius="base">
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    Product
                  </th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    Issue
                  </th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    Severity
                  </th>
                  <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    Suggested fix
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    —
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    No issues yet
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    —
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    Run a scan after product import is connected.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </s-box>
      </s-section>

      <s-section slot="aside" heading="MVP scope">
        <s-paragraph>
          MerchantFix is currently focused on deterministic product catalog
          checks for Google Shopping readiness.
        </s-paragraph>

        <s-unordered-list>
          <s-list-item>No Google Merchant Center API yet</s-list-item>
          <s-list-item>No Shopify Billing yet</s-list-item>
          <s-list-item>No AI suggestions yet</s-list-item>
          <s-list-item>No storefront or checkout extensions</s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Next build steps">
        <s-unordered-list>
          <s-list-item>Fetch products from Shopify Admin GraphQL API</s-list-item>
          <s-list-item>Create product snapshot type</s-list-item>
          <s-list-item>Add missing barcode scanner rule</s-list-item>
          <s-list-item>Show real product issues in this dashboard</s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};