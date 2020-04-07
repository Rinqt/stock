namespace Stock.Api.Configuration
{
    public static class Routes
    {
        public const string BaseRoute = "api/";

        public static class Articles
        {
            public const string Route = "articles";
            public const string All = "all";
        }

        public static class MlModels
        {
            public const string Route = "ml";
            public const string All = "all";
            public const string Types = "types";
            public const string Default = "default";
        }

        public static class Users
        {
            public const string Route = "users";
            public const string Info = "info";
            public const string Settings = "settings";
            public const string SearchHistory = "search-history";
        }

        public static class Stocks
        {
            public const string Route = "stocks";
            public const string All = "all";
            public const string Latest = "latest";
        }

        public static class Companies
        {
            public const string Route = "companies";
            public const string All = "all";
        }

        public static class Auth
        {
            public const string Route = "auth";
            public const string SignUp = "sign-up";
            public const string ConfirmSignUp = "confirm-sign-up";
            public const string SignIn = "sign-in";
            public const string ForgotPassword = "forgot-password";
            public const string ResetPassword = "reset-password";
            public const string ChangePassword = "change-password";
            public const string UpdateToken = "update-token";
            public const string SignOut = "sign-out";
        }
    }
}
