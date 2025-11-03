function getEmirateInEnglish(arabicValue) {
  switch (arabicValue) {
    case "أبو ظبي":
      return "Abu Dhabi"; //done
    case "إمارة الشارقةّ":
      return "Sharjah"; //done
    case "الفجيرة":
      return "Fujairah"; //done
    case "ام القيوين":
      return "Umm Al Quwain"; //done
    case "إمارة دبيّ":
      return "Dubai"; //done
    case "إمارة رأس الخيمة":
      return "Ras al Khaimah"; //done
    case "عجمان":
      return "Ajman"; //done
    default:
      return "Unknown Emirate"; // Return default if value is not found
  }
}

module.exports = { getEmirateInEnglish };
