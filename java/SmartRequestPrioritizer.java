import java.util.Locale;

public class SmartRequestPrioritizer {

    public static void main(String[] args) {

        if (args.length < 4) {
            System.out.println("0|LOW");
            return;
        }

        String documentType = args[0].toUpperCase(Locale.ROOT);
        String year = args[1];
        int daysWaiting = parseInt(args[2]);
        String purpose = args[3].toLowerCase(Locale.ROOT);

        int score = 0;

        if (documentType.equals("TRANSCRIPT")) {
            score += 30;
        } else if (documentType.equals("RECOMMENDATION")) {
            score += 25;
        } else if (documentType.equals("BONAFIDE")) {
            score += 15;
        } else {
            score += 10;
        }

        int academicYear = parseYear(year);

        if (academicYear >= 4) {
            score += 20;
        } else if (academicYear == 3) {
            score += 10;
        } else if (academicYear == 2) {
            score += 5;
        }

        if (daysWaiting >= 7) {
            score += 15;
        } else if (daysWaiting >= 3) {
            score += 8;
        }

        if (containsAny(
                purpose,
                "emergency",
                "urgent",
                "immediately",
                "today",
                "tomorrow",
                "deadline",
                "last date")) {

            score += 30;

        } else if (containsAny(
                purpose,
                "internship",
                "placement",
                "interview",
                "admission",
                "visa",
                "higher studies",
                "scholarship")) {

            score += 20;
        }

        String priority;

        if (score >= 75) {
            priority = "HIGH";
        } else if (score >= 50) {
            priority = "MEDIUM";
        } else {
            priority = "LOW";
        }

        System.out.println(score + "|" + priority);
    }

    private static boolean containsAny(String text, String... keywords) {

        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    private static int parseYear(String value) {

        if (value == null || value.trim().isEmpty()) {
            return 0;
        }

        try {
            String numbers = value.replaceAll("[^0-9]", "");

            if (numbers.isEmpty()) {
                return 0;
            }

            return Integer.parseInt(numbers);

        } catch (Exception e) {
            return 0;
        }
    }

    private static int parseInt(String value) {

        try {
            return Integer.parseInt(value);
        } catch (Exception e) {
            return 0;
        }
    }
}