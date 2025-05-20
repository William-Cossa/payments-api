import axios from "axios";
import { API_PASSWORD, API_URL, CURRENCY, MERCHANT, SCRIPT_URL, } from "../config/env.js";
import { generateOrderId } from "../utils/generateOrderId.js";
export const createCheckoutSession = async (req, res, next) => {
    try {
        const { amount, returnUrl } = req.body;
        const orderId = generateOrderId();
        console.log(" Amount: " + amount, " ReturnUrl: " + returnUrl);
        const data = new URLSearchParams({
            apiOperation: "CREATE_CHECKOUT_SESSION",
            apiPassword: API_PASSWORD,
            apiUsername: `merchant.${MERCHANT}`,
            merchant: MERCHANT,
            "order.id": orderId,
            "order.amount": amount,
            "order.currency": CURRENCY,
            "interaction.operation": "PURCHASE",
            "interaction.returnUrl": returnUrl,
        });
        const response = await axios.post(API_URL, data.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        console.log("Full API Response:", response.data);
        const sessionId = response.data
            ?.split("&")
            .find((param) => param.startsWith("session.id="))
            ?.split("=")[1];
        const successIndicator = response.data
            ?.split("&")
            .find((param) => param.startsWith("successIndicator="))
            ?.split("=")[1];
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        res.json({
            successIndicator,
            sessionId,
            orderId,
            apiPassword: API_PASSWORD,
            fullResponse: response.data,
            url: `${baseUrl}/api/v1/payments/millenium-bim/checkout?sessionId=${sessionId}&orderId=${orderId}&amount=${amount}`,
        });
        // res.redirect(
        //   `/api/v1/payments/millenium-bim/checkout?sessionId=${sessionId}&orderId=${orderId}&amount=${amount}`
        // );
    }
    catch (error) {
        console.error("Erro Criando checkout session:", error);
        res.status(500).json({
            error: "Failed to create checkout session",
            details: error.response?.data,
        });
    }
};
export const startCheckout = (req, res, next) => {
    const { sessionId, orderId, amount, currency = "MZN" } = req.query;
    if (!sessionId || !orderId || !amount) {
        const error = new Error("Dados inválidos");
        error.statusCode = 400;
        throw error;
    }
    res.send(`
   <!DOCTYPE html>
   <head>
    <title>Processando pagamento</title>
    <style>
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f9f9f9;
      font-family: sans-serif;
    "
  >
    <h2 style="margin-bottom: 20px;">A processar o pagamento...</h2>

    <div
      style="
        width: 40px;
        height: 40px;
        border: 4px solid #ccc;
        border-top: 4px solid #4f46e5;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "
    ></div>
      <script>
        function loadScript(src, callback) {
          const script = document.createElement('script');
          script.src = src;
          script.onload = callback;
          document.head.appendChild(script);
        }

        loadScript("${SCRIPT_URL}", function () {
          Checkout.configure({
            merchant: "${MERCHANT}",
            order: {
              amount: "${amount}",
              currency: "${currency}",
              description: "Pagamento de curso na Unitec Academy",
              id: "${orderId}"
            },
            session: {
              id: "${sessionId}"
            },
            interaction: {
              operation: "PURCHASE",
              locale: "pt_PT",
              merchant: {
                name: "Unitec Academy",
                address: {
                  line1: "Av. Karl Marx, 1128", 
                  line2: "Maputo"
                },
                email: "geral@paytech.tech",
                phone: "+258 123456789" 
              },
              displayControl:{
                billingAddress: 'HIDE',
                customerEmail: 'HIDE'
              }
            }
          });

          Checkout.showLightbox();
        });
      </script>
    </body>
  </html>
`);
};
export const sucessPaymentCheck = (req, res, next) => {
    const { resultIndicator, sessionVersion } = req.query;
    if (!resultIndicator || !sessionVersion) {
        const error = new Error("O pagamento ocorreu sem sucesso!");
        error.statusCode = 402;
        throw error;
    }
    console.log(`Pagament ocorreu com sucesso!...\nCódigo:${resultIndicator}\nSession Version: ${sessionVersion}`);
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pagamento bem sucedido</title>
      </head>
      <body>
        <h2>Pagamento bem sucedido!</h2>
        <p>Resultado do pagamento: ${resultIndicator}</p>
        <p>Versão da sessão: ${sessionVersion}</p>
      </body>
    </html>
  `);
};
