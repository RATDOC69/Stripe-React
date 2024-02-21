import axios from 'axios';
import "bootswatch/dist/lux/bootstrap.min.css";
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51LgXWWLm30s7rFnnktKXxBSpFMb0JGG6vYZDY7uhK5COloUusUKtOFm8iCoPB5Ua55WUsDRDwi79U0TepwY0El6a00tVC129Nn')

const SubscriptionForm = () => {

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const {id} = paymentMethod;

      const { data } = await axios.post('http://localhost:8000/create-subscription/', {
        priceId: 'price_1Om4HwLm30s7rFnnH8HWbkNr',
        paymentId: id,
      });

      console.log(data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img src="chama.png" className="img-fluid" alt="Yatusabes"/>
      <div className="form-group">
        <CardElement className="form-control" />
      </div>
      <button className="btn btn-success" type="submit" disabled={!stripe}>
        Suscribirse
      </button>
    </form>
  )
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
