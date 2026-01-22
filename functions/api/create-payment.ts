interface MercadoPagoResponse {
    id?: string;
    status?: string;
    point_of_interaction?: {
        transaction_data?: {
            qr_code: string;
            qr_code_base64: string;
            ticket_url: string;
        }
    };
    error?: string;
    message?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cause?: any;
}

export const onRequestPost = async (context) => {
    // Token de Produção fornecido pelo usuário
    const token = "APP_USR-233787625021211-011103-2cfc9a9b55695cb0faddbfc47c7b08ef-3095772720";

    try {
        const { plan, payer, device_id } = await context.request.json();

        if (!plan || !payer) {
            return new Response(JSON.stringify({ error: "Dados incompletos" }), { status: 400 });
        }

        // Tratamento do preço (Ex: "R$ 29,90" -> 29.90)
        // Remove R$, remove pontos de milhar, troca vírgula decimal por ponto
        const priceString = plan.price.replace("R$", "").replaceAll(".", "").replace(",", ".").trim();
        const price = parseFloat(priceString);

        if (isNaN(price)) {
            return new Response(JSON.stringify({ error: "Preço inválido", received: plan.price }), { status: 400 });
        }

        const payload = {
            transaction_amount: price,
            description: `BootFlow - ${plan.name}`,
            payment_method_id: "pix",
            payer: {
                email: payer.email,
                first_name: payer.name.split(" ")[0],
                last_name: payer.name.split(" ").slice(1).join(" ") || "Cliente",
                identification: {
                    type: "CPF",
                    number: payer.cpf.replace(/\D/g, "") // Apenas números
                }
            },
            // Additional info for fraud prevention
            additional_info: {
                ip_address: context.request.headers.get('cf-connecting-ip') || context.request.headers.get('x-forwarded-for') || '',
                payer: {
                    first_name: payer.name.split(" ")[0],
                    last_name: payer.name.split(" ").slice(1).join(" ") || "Cliente",
                }
            },
            // Expira em 30 minutos
            date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };

        // Add device_id if available (required for Mercado Pago fraud prevention)
        const headers: Record<string, string> = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": crypto.randomUUID()
        };

        // Add device ID header if provided
        if (device_id) {
            headers["X-meli-session-id"] = device_id;
        }

        const response = await fetch("https://api.mercadopago.com/v1/payments", {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });

        const data = await response.json() as MercadoPagoResponse;

        if (!response.ok) {
            console.error("Erro MP:", data);
            return new Response(JSON.stringify({ error: "Falha ao criar pagamento", details: data }), {
                status: response.status,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Retorna apenas os dados relevantes para o QR Code
        const result = {
            id: data.id,
            status: data.status,
            qr_code: data.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
            ticket_url: data.point_of_interaction?.transaction_data?.ticket_url
        };

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
