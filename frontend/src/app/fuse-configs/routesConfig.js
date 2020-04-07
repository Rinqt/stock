import React from "react";
import { Redirect } from "react-router-dom";
import { FuseUtils } from "@fuse/index";
import { DashboardConfig } from "app/main/dashboard/DashboardConfig.js";
import { CompaniesConfig } from "app/main/companies/CompaniesConfig.js";
import { HistoryConfig } from "app/main/history/HistoryConfig.js";
import { ArticleDetailsConfig } from "app/main/article-details/ArticleDetailsConfig.js";
import { CompanyDetailsConfig } from "app/main/company-details/CompanyDetailsConfig.js";
import { ProfileConfig } from "app/main/profile/ProfileConfig.js";
import { AnalysisConfig } from "app/main/analysis/AnalysisConfig.js";
import { AddModelConfig } from "app/main/analysis/add-model/AddModelConfig.js";
import { ViewModelConfig } from "app/main/analysis/view-model/ViewModelConfig.js";
import { CompareModelConfig } from "app/main/analysis/compare-models/CompareModelsConfig.js";
import { LoginPageConfig } from "app/main/auth/login/LoginPageConfig.js";
import { RegisterPageConfig } from "app/main/auth/register/RegisterPageConfig.js";
import { ForgotPasswordPageConfig } from "app/main/auth/forgot-password/ForgotPasswordPageConfig.js";
import { MailConfirmPageConfig } from "app/main/auth/mail-confirm/MailConfirmPageConfig.js";
import { ResetPasswordPageConfig } from "app/main/auth/reset-password/ResetPasswordPageConfig.js";
import { Error404PageConfig } from "app/main/404/Error404PageConfig.js"

const routeConfigs = [
  DashboardConfig,
  LoginPageConfig,
  RegisterPageConfig,
  CompaniesConfig,
  HistoryConfig,
  ArticleDetailsConfig,
  CompanyDetailsConfig,
  ProfileConfig,
  AddModelConfig,
  ViewModelConfig,
  CompareModelConfig,
  AnalysisConfig,
  ForgotPasswordPageConfig,
  MailConfirmPageConfig,
  ResetPasswordPageConfig,
  Error404PageConfig
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/app/dashboard" />
  },
  {
    component: () => <Redirect to="/app/dashboard" />
  }
];

export default routes;
