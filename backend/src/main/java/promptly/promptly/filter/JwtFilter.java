package promptly.promptly.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.filter.OncePerRequestFilter;

import promptly.promptly.utils.JwtAuth;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtAuth jwtAuth;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        try {
            final String authorizationHeader = request.getHeader("Authorization");
            String path = request.getRequestURI();
            
            if (path.equals("/api/auth/register") || path.equals("/api/auth/login")){
                chain.doFilter(request, response);
                return;
            }

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                throw new ServletException("Authorization header is missing or invalid.");
            }

            String jwt = authorizationHeader.substring(7); // Extract JWT token
            String userId = jwtAuth.extractUserIdFromToken(jwt); // Extract user ID from token

            if (userId == null) {
                throw new ServletException("Invalid token.");
            }

            System.out.println("User ID from JWT: " + userId);

            request.setAttribute("userId", Integer.parseInt(userId));

            chain.doFilter(request, response);

        } catch (ServletException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            response.getWriter().write("{\n\t\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}