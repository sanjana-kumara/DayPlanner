package model;

public class Util {
    
    public static String generateCode(){
        
        int r = (int) (Math.random()*1000000);
        
        return String.format("%06d", r);
        
    }
    
    public static boolean isEmailValid(String email){
        
        return email.matches("^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$");
        
    }
    
    public static boolean isPasswordValid(String password){
        
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$");
        
    }
    
    public static boolean isValidMobileNumber(String number){
        
        return number.matches("^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$");
        
    }
    
    public static boolean isPostalCodeValid(String code) {
        
        return code.matches("^\\d{4,5}$");

    }
    
    public static boolean isInteger(String value) {
        
        return value.matches("^\\d+$");

    }
    
    public static boolean isDouble(String value) {
        
        return value.matches("^\\d+(\\.\\d{2})?$");

    }
    
}
