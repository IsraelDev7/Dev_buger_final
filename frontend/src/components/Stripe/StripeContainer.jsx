import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutFormStripe } from './CheckoutFormStripe';
import api from '../../services/api';

// Inicializa o Stripe fora da renderização do componente
const stripePromise = loadStripe('pk_live_51OZiu3KFfQt5HdVGGEVmrkDpSEKSTB2fL5JV0QWUfZ3uUCNZW4RISibQCYrmrsaSsGkRYnNufTfTEXPMRDtUpMNm00eSkBjcYQ');

export function StripeContainer({ totalAmount, orderData }) {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        async function getPaymentIntent() {
            try {
                // O Backend espera totalAmount (que já deve vir em centavos ou ser tratado lá)
                const response = await api.post('/create-payment-intent', { totalAmount });
                setClientSecret(response.data.clientSecret);
            } catch (error) {
                console.error("Erro ao gerar intenção de pagamento", error);
            }
        }
        
        if (totalAmount > 0) {
            getPaymentIntent();
        }
    }, [totalAmount]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#9758a6',
        },
    };

    return (
        <div className="stripe-wrapper mt-4">
            {clientSecret ? (
                <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
                    <CheckoutFormStripe orderData={orderData} />
                </Elements>
            ) : (
                <div className="flex justify-center p-4">
                    <p className="text-gray-500 italic">Preparando pagamento seguro...</p>
                </div>
            )}
        </div>
    );
}
