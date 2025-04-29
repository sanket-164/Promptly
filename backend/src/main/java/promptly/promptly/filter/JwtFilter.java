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
            
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.setHeader("Access-Control-Allow-Origin", "*");
                response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
                return;
            }

            String path = request.getRequestURI();
            
            if (path.startsWith("/api/auth/") || path.endsWith(".html")) {
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
            response.setHeader("Access-Control-Allow-Origin", "*"); // or your frontend origin
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\n\t\"error\": \"" + e.getMessage() + "\"\n}");
            return;
        }
    }
}