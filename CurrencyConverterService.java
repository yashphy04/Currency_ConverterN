import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import java.util.Map;

@Service
public class CurrencyConverterService {
    private static final Logger logger = LoggerFactory.getLogger(CurrencyConverterService.class);
    private static final String API_URL = "https://api.exchangerate-api.com/v4/latest/";

    private final RestTemplate restTemplate;

    public CurrencyConverterService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public double convertCurrency(String from, String to, double amount) {
        try {
            String url = API_URL + from;
            logger.info("Fetching exchange rate from API: {}", url);

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response == null || !response.containsKey("rates")) {
                throw new RuntimeException("Invalid response from API");
            }

            Map<String, Double> rates = (Map<String, Double>) response.get("rates");
            if (!rates.containsKey(to)) {
                throw new RuntimeException("Invalid currency code: " + to);
            }

            double exchangeRate = rates.get(to);
            logger.info("Exchange rate {} -> {}: {}", from, to, exchangeRate);

            return amount * exchangeRate;
        } catch (HttpClientErrorException e) {
            logger.error("HTTP error while fetching exchange rates: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch exchange rates. Please try again later.");
        } catch (RestClientException e) {
            logger.error("Error connecting to exchange rate API: {}", e.getMessage());
            throw new RuntimeException("Service unavailable. Please try again later.");
        }
    }
}
