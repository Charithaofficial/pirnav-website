namespace Pirnav.API.Security
{
    public static class FileSecurity
    {
        public static bool IsValidResume(byte[] fileBytes)
        {
            // PDF signature
            if (fileBytes.Length > 4 &&
                fileBytes[0] == 0x25 &&
                fileBytes[1] == 0x50 &&
                fileBytes[2] == 0x44 &&
                fileBytes[3] == 0x46)
                return true;

            // DOCX signature (ZIP)
            if (fileBytes.Length > 2 &&
                fileBytes[0] == 0x50 &&
                fileBytes[1] == 0x4B)
                return true;

            return false;
        }
    }
}