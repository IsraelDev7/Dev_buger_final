import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../hooks/CartContext';
import api from '../../services/api';

export function CheckoutFormStripe({ orderData }) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    
    const [errorMessage, setErrorMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || isProcessing) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`, 
            },
            redirect: 'if_required'
        });

        if (error) {
            setErrorMessage(error.message);
            toast.error(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                // Pagamento aprovado! Agora salvamos o pedido no nosso banco
                await api.post('/orders', {
                    ...orderData,
                    status: 'Pedido realizado'
                });
                
                setIsProcessing(false);
                toast.success("Pagamento e pedido realizados com sucesso!");
                clearCart();
                navigate('/checkout/success');
            } catch (err) {
                toast.error("Pagamento aprovado, mas erro ao salvar pedido. Entre em contato com o suporte.");
                setIsProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} id="payment-form" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <PaymentElement id="payment-element" />
            
            <button 
                disabled={isProcessing || !stripe || !elements} 
                id="submit" 
                className="mt-6 w-full bg-[#9758a6] text-white py-4 rounded-md font-bold text-xl hover:bg-[#7d488a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
                <span id="button-text">
                    {isProcessing ? "Processando..." : "CONFIRMAR E PAGAR"}
                </span>
            </button>

            {errorMessage && <div id="payment-message" className="text-red-500 mt-4 text-center text-sm font-medium">{errorMessage}</div>}
        </form>
    );
}
