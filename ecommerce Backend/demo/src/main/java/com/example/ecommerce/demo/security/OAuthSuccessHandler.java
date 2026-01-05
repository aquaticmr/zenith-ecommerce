package com.example.ecommerce.demo.security;



import com.example.ecommerce.demo.entity.Role;
import com.example.ecommerce.demo.entity.User;
import com.example.ecommerce.demo.respository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class OAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired private JwtUtils jwtUtils;
    @Autowired private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // Inside onAuthenticationSuccess method
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(oauthUser.getAttribute("name"));
            newUser.setProvider("SOCIAL");
            newUser.setRole(Role.USER); // <--- MAKE SURE THIS LINE IS HERE
            return userRepository.save(newUser);
        });

// IMPORTANT: Check if existing users have a null role
        if (user.getRole() == null) {
            user.setRole(Role.USER);
            user = userRepository.save(user);
        }

// Now this will not throw NullPointerException
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());


        // Redirect to your Next.js callback route
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:3000/callback?token=" + token);
    }
}