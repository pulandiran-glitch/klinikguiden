# Stripe setup til KlinikGuiden

Historisk reference.

Der er ikke et aktivt Stripe-checkoutflow i den nuværende version af sitet.

## Aktuel status

- `create-checkout-session` svarer med en deaktiveret besked.
- Shop- og guidesiderne skal ikke sende brugeren til betaling.
- Der er derfor ingen aktive Stripe-variabler, der skal bruges til checkout i den nuværende opsætning.

## Hvis betaling senere genåbnes

Opret en ny og aktuel tjekliste til det faktiske flow, før der testes eller deployes igen.
