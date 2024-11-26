//package ru.kata.spring.boot_security.demo.services;
//
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class EmailService {
//
//    // Метод для отправки писем на несколько адресов
//    public void sendEmailsToAddresses(List<String> emailAddresses) throws MessagingException {
//        for (String email : emailAddresses) {
//            sendEmail(email);
//        }
//    }
//
//    // Метод для отправки одного письма
//    private void sendEmail(String emailAddress) throws MessagingException {
//        // Здесь будет код для отправки письма через вашу почтовую службу (например, JavaMailSender)
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(emailAddress);
//        message.setSubject("Your subject");
//        message.setText("Email content here...");
//        mailSender.send(message); // Отправка письма
//    }
//}
