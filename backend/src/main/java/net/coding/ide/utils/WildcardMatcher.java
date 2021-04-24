package net.coding.ide.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class WildcardMatcher {
    private static final String metaCharacters = "(){}[]-^$.?*+|\\";

    private static String toRegexPattern(String wildcardPattern) {
        StringBuilder sb = new StringBuilder();
        for (char p : wildcardPattern.toCharArray()) {
            boolean contain = false;
            for (char m : metaCharacters.toCharArray()) {
                if (p == m) {
                    contain = true;
                    break;
                }
            }

            if (contain) {
                switch (p) {
                    case '*':
                        sb.append(".*");
                        break;

                    default:
                        sb.append('\\').append(p);
                }
            } else {
                sb.append(p);
            }
        }

        return sb.toString();
    }

    public static boolean match(String text, String wildcardPattern) {
        Pattern pattern = Pattern.compile(toRegexPattern(wildcardPattern), Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        Matcher matcher = pattern.matcher(text);
        return matcher.find();
    }

}
