package prompthub.prompthub.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtAuth {

    private static final String SECRET_KEY = "yoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkeyyoursecretkey"; // Replace with a secure key
    private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds

    public String generateToken(Integer user_id) {
        return Jwts.builder()
                .setSubject(user_id.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public boolean isValidToken(String token) {
        try {
            Date expirationDate = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();

            return !expirationDate.before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUserIdFromToken(String token) {
        try {
            
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Remove "Bearer " prefix
            }
            
            String extractedUserid = Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
            return extractedUserid;
        } catch (Exception e) {
            return null;
        }
    }


}