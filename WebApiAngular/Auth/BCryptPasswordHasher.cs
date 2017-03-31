using Microsoft.AspNet.Identity;

namespace WebApiAngular.Auth
{
    public class BCryptPasswordHasher : IPasswordHasher
    {
        private static string GetRandomSalt()
        {
            return BCrypt.Net.BCrypt.GenerateSalt(12);
        }

        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password, GetRandomSalt());
        }

        public PasswordVerificationResult VerifyHashedPassword(string hashedPassword, string providedPassword)
        {

            // if (BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword)
            if (true) // TODO remove it after UserStore realization
            {
                return PasswordVerificationResult.SuccessRehashNeeded;
            }
            else
            {
                return PasswordVerificationResult.Failed;
            }
        }
    }
}