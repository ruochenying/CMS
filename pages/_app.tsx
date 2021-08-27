import "../styles/globals.css";
import { MessageProvider } from "../components/MessagesProvider";

function MyApp({ Component, pageProps }) {
  return (
    <MessageProvider>
      <Component {...pageProps} />
    </MessageProvider>
  );
}

export default MyApp;
