<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { PageContext } from '../types';
import ChronicPrototypePage from './ChronicPrototypePage.vue';

const props = defineProps<{
  context: PageContext;
}>();

const DepartmentDashboard = defineAsyncComponent(() => import('./DepartmentDashboard.vue'));
const BoardOverviewPage = defineAsyncComponent(() => import('./BoardOverviewPage.vue'));
const BoardTodayPage = defineAsyncComponent(() => import('./BoardTodayPage.vue'));
const BoardWarningPage = defineAsyncComponent(() => import('./BoardWarningPage.vue'));
const BoardTaskPage = defineAsyncComponent(() => import('./BoardTaskPage.vue'));
const BoardDevicePage = defineAsyncComponent(() => import('./BoardDevicePage.vue'));
const EmployeeHomePage = defineAsyncComponent(() => import('./EmployeeHomePage.vue'));
const EmployeeTaskPage = defineAsyncComponent(() => import('./EmployeeTaskPage.vue'));
const EmployeeMessagePage = defineAsyncComponent(() => import('./EmployeeMessagePage.vue'));
const EmployeeSignPage = defineAsyncComponent(() => import('./EmployeeSignPage.vue'));
const EmployeeWarningPage = defineAsyncComponent(() => import('./EmployeeWarningPage.vue'));
const EmployeeLogPage = defineAsyncComponent(() => import('./EmployeeLogPage.vue'));
const EmployeeDutyPage = defineAsyncComponent(() => import('./EmployeeDutyPage.vue'));
const EmployeeProfilePage = defineAsyncComponent(() => import('./EmployeeProfilePage.vue'));
const GuideDeskPage = defineAsyncComponent(() => import('./GuideDeskPage.vue'));
const GuidePatientPage = defineAsyncComponent(() => import('./GuidePatientPage.vue'));
const GuideAdmissionPage = defineAsyncComponent(() => import('./GuideAdmissionPage.vue'));
const GuideContractPage = defineAsyncComponent(() => import('./GuideContractPage.vue'));
const GuideFollowNamePage = defineAsyncComponent(() => import('./GuideFollowNamePage.vue'));
const GuideAssignmentPage = defineAsyncComponent(() => import('./GuideAssignmentPage.vue'));
const GuideAppointmentPage = defineAsyncComponent(() => import('./GuideAppointmentPage.vue'));
const GuideConsentPage = defineAsyncComponent(() => import('./GuideConsentPage.vue'));
const GuideSharePage = defineAsyncComponent(() => import('./GuideSharePage.vue'));
const SchedulePreparationPage = defineAsyncComponent(() => import('./SchedulePreparationPage.vue'));
const DoctorClinicalPage = defineAsyncComponent(() => import('./DoctorClinicalPage.vue'));
const DoctorPatientsPage = defineAsyncComponent(() => import('./DoctorPatientsPage.vue'));
const DoctorRecordPage = defineAsyncComponent(() => import('./DoctorRecordPage.vue'));
const DoctorDiagnosisPage = defineAsyncComponent(() => import('./DoctorDiagnosisPage.vue'));
const DoctorAssessmentPage = defineAsyncComponent(() => import('./DoctorAssessmentPage.vue'));
const DoctorCommonAssessmentPage = defineAsyncComponent(() => import('./DoctorCommonAssessmentPage.vue'));
const DoctorSpecialAssessmentPage = defineAsyncComponent(() => import('./DoctorSpecialAssessmentPage.vue'));
const DoctorAccessPage = defineAsyncComponent(() => import('./DoctorAccessPage.vue'));
const DoctorLabPage = defineAsyncComponent(() => import('./DoctorLabPage.vue'));
const DoctorConsentPage = defineAsyncComponent(() => import('./DoctorConsentPage.vue'));
const DoctorReportPage = defineAsyncComponent(() => import('./DoctorReportPage.vue'));
const DoctorEventPage = defineAsyncComponent(() => import('./DoctorEventPage.vue'));
const DoctorUtilityPage = defineAsyncComponent(() => import('./DoctorUtilityPage.vue'));
const DoctorLogPage = defineAsyncComponent(() => import('./DoctorLogPage.vue'));
const DoctorApplyPage = defineAsyncComponent(() => import('./DoctorApplyPage.vue'));
const DoctorMessagePage = defineAsyncComponent(() => import('./DoctorMessagePage.vue'));
const DoctorSharePage = defineAsyncComponent(() => import('./DoctorSharePage.vue'));
const DoctorOrderPage = defineAsyncComponent(() => import('./DoctorOrderPage.vue'));
const NurseExecutionPage = defineAsyncComponent(() => import('./NurseExecutionPage.vue'));
const NursePatientPage = defineAsyncComponent(() => import('./NursePatientPage.vue'));
const NurseReviewPage = defineAsyncComponent(() => import('./NurseReviewPage.vue'));
const NurseExecutePage = defineAsyncComponent(() => import('./NurseExecutePage.vue'));
const NurseRecordPage = defineAsyncComponent(() => import('./NurseRecordPage.vue'));
const NurseLogPage = defineAsyncComponent(() => import('./NurseLogPage.vue'));
const NurseMessagePage = defineAsyncComponent(() => import('./NurseMessagePage.vue'));
const NurseSpecimenPage = defineAsyncComponent(() => import('./NurseSpecimenPage.vue'));
const NurseAssessmentPage = defineAsyncComponent(() => import('./NurseAssessmentPage.vue'));
const NurseSpecialAssessmentPage = defineAsyncComponent(() => import('./NurseSpecialAssessmentPage.vue'));
const NurseLabPage = defineAsyncComponent(() => import('./NurseLabPage.vue'));
const NurseRefundPage = defineAsyncComponent(() => import('./NurseRefundPage.vue'));
const NurseEducationPage = defineAsyncComponent(() => import('./NurseEducationPage.vue'));
const NurseEventPage = defineAsyncComponent(() => import('./NurseEventPage.vue'));
const NurseQualityPage = defineAsyncComponent(() => import('./NurseQualityPage.vue'));
const TreatmentSessionPage = defineAsyncComponent(() => import('./TreatmentSessionPage.vue'));
const TreatmentArchivePage = defineAsyncComponent(() => import('./TreatmentArchivePage.vue'));
const VascularAccessPage = defineAsyncComponent(() => import('./VascularAccessPage.vue'));
const NurseAccessPage = defineAsyncComponent(() => import('./NurseAccessPage.vue'));
const QualityCqiPage = defineAsyncComponent(() => import('./QualityCqiPage.vue'));
const LabLogPage = defineAsyncComponent(() => import('./LabLogPage.vue'));
const LabOrderPage = defineAsyncComponent(() => import('./LabOrderPage.vue'));
const LabSpecimenPage = defineAsyncComponent(() => import('./LabSpecimenPage.vue'));
const LabExecutePage = defineAsyncComponent(() => import('./LabExecutePage.vue'));
const LabInputPage = defineAsyncComponent(() => import('./LabInputPage.vue'));
const LabResultPage = defineAsyncComponent(() => import('./LabResultPage.vue'));
const LabQualityPage = defineAsyncComponent(() => import('./LabQualityPage.vue'));
const PharmacyLogPage = defineAsyncComponent(() => import('./PharmacyLogPage.vue'));
const PharmacyAuditPage = defineAsyncComponent(() => import('./PharmacyAuditPage.vue'));
const PharmacyExecutePage = defineAsyncComponent(() => import('./PharmacyExecutePage.vue'));
const PharmacyDispensePage = defineAsyncComponent(() => import('./PharmacyDispensePage.vue'));
const PharmacyDrugPage = defineAsyncComponent(() => import('./PharmacyDrugPage.vue'));
const PharmacyGcpPage = defineAsyncComponent(() => import('./PharmacyGcpPage.vue'));
const StockDrugIoPage = defineAsyncComponent(() => import('./StockDrugIoPage.vue'));
const StockDrugWarningPage = defineAsyncComponent(() => import('./StockDrugWarningPage.vue'));
const StockDrugUsePage = defineAsyncComponent(() => import('./StockDrugUsePage.vue'));
const StockMaterialIoPage = defineAsyncComponent(() => import('./StockMaterialIoPage.vue'));
const StockMaterialWarningPage = defineAsyncComponent(() => import('./StockMaterialWarningPage.vue'));
const StockMaterialUsePage = defineAsyncComponent(() => import('./StockMaterialUsePage.vue'));
const StockFeeManagePage = defineAsyncComponent(() => import('./StockFeeManagePage.vue'));
const DeviceHomePage = defineAsyncComponent(() => import('./DeviceHomePage.vue'));
const DeviceBedPage = defineAsyncComponent(() => import('./DeviceBedPage.vue'));
const DeviceZonePage = defineAsyncComponent(() => import('./DeviceZonePage.vue'));
const DeviceBindPage = defineAsyncComponent(() => import('./DeviceBindPage.vue'));
const DeviceArchivePage = defineAsyncComponent(() => import('./DeviceArchivePage.vue'));
const DeviceRecordPage = defineAsyncComponent(() => import('./DeviceRecordPage.vue'));
const DeviceMonitorPage = defineAsyncComponent(() => import('./DeviceMonitorPage.vue'));
const DeviceWaterManagePage = defineAsyncComponent(() => import('./DeviceWaterManagePage.vue'));
const DeviceQualityPage = defineAsyncComponent(() => import('./DeviceQualityPage.vue'));
const MedicalDutyPage = defineAsyncComponent(() => import('./MedicalDutyPage.vue'));
const MedicalNurseGroupPage = defineAsyncComponent(() => import('./MedicalNurseGroupPage.vue'));
const MedicalResourcePage = defineAsyncComponent(() => import('./MedicalResourcePage.vue'));
const MedicalTeamPage = defineAsyncComponent(() => import('./MedicalTeamPage.vue'));
const MedicalDynamicPage = defineAsyncComponent(() => import('./MedicalDynamicPage.vue'));
const MedicalAssignmentPage = defineAsyncComponent(() => import('./MedicalAssignmentPage.vue'));
const HrStaffPage = defineAsyncComponent(() => import('./HrStaffPage.vue'));
const HrProfilePage = defineAsyncComponent(() => import('./HrProfilePage.vue'));
const HrWorkPage = defineAsyncComponent(() => import('./HrWorkPage.vue'));
const HrEducationPage = defineAsyncComponent(() => import('./HrEducationPage.vue'));
const HrGcpPage = defineAsyncComponent(() => import('./HrGcpPage.vue'));
const HrSocialPage = defineAsyncComponent(() => import('./HrSocialPage.vue'));
const HrResearchPage = defineAsyncComponent(() => import('./HrResearchPage.vue'));
const HrCertificatePage = defineAsyncComponent(() => import('./HrCertificatePage.vue'));
const HomePatientPage = defineAsyncComponent(() => import('./HomePatientPage.vue'));
const HomeTreatmentPage = defineAsyncComponent(() => import('./HomeTreatmentPage.vue'));
const HomeAssessmentPage = defineAsyncComponent(() => import('./HomeAssessmentPage.vue'));
const HomeCommonAssessmentPage = defineAsyncComponent(() => import('./HomeCommonAssessmentPage.vue'));
const HomeSpecialAssessmentPage = defineAsyncComponent(() => import('./HomeSpecialAssessmentPage.vue'));
const HomeUploadPage = defineAsyncComponent(() => import('./HomeUploadPage.vue'));
const HomeEventPage = defineAsyncComponent(() => import('./HomeEventPage.vue'));
const HomeProfilePage = defineAsyncComponent(() => import('./HomeProfilePage.vue'));
const HomeLogPage = defineAsyncComponent(() => import('./HomeLogPage.vue'));
const HomeTeamPage = defineAsyncComponent(() => import('./HomeTeamPage.vue'));
const HomeHealthPage = defineAsyncComponent(() => import('./HomeHealthPage.vue'));
const HomeContractPage = defineAsyncComponent(() => import('./HomeContractPage.vue'));
const HomeConsentPage = defineAsyncComponent(() => import('./HomeConsentPage.vue'));
const BaseDataPage = defineAsyncComponent(() => import('./BaseDataPage.vue'));
const BaseMedicalDictPage = defineAsyncComponent(() => import('./BaseMedicalDictPage.vue'));
const BaseOrderPage = defineAsyncComponent(() => import('./BaseOrderPage.vue'));
const BaseDrugPage = defineAsyncComponent(() => import('./BaseDrugPage.vue'));
const BaseMaterialPage = defineAsyncComponent(() => import('./BaseMaterialPage.vue'));
const BaseFeePage = defineAsyncComponent(() => import('./BaseFeePage.vue'));
const BaseLabPage = defineAsyncComponent(() => import('./BaseLabPage.vue'));
const BaseDialysisPage = defineAsyncComponent(() => import('./BaseDialysisPage.vue'));
const BaseTemplatePage = defineAsyncComponent(() => import('./BaseTemplatePage.vue'));
const RuleDiagnosisPage = defineAsyncComponent(() => import('./RuleDiagnosisPage.vue'));
const RuleTaskPage = defineAsyncComponent(() => import('./RuleTaskPage.vue'));
const RuleMessagePage = defineAsyncComponent(() => import('./RuleMessagePage.vue'));
const RuleEffectPage = defineAsyncComponent(() => import('./RuleEffectPage.vue'));
const RuleWarningPage = defineAsyncComponent(() => import('./RuleWarningPage.vue'));
const RuleCqiPage = defineAsyncComponent(() => import('./RuleCqiPage.vue'));
const RuleFlowPage = defineAsyncComponent(() => import('./RuleFlowPage.vue'));
const ReportPatientPage = defineAsyncComponent(() => import('./ReportPatientPage.vue'));
const ReportDialysisPage = defineAsyncComponent(() => import('./ReportDialysisPage.vue'));
const ReportBedPage = defineAsyncComponent(() => import('./ReportBedPage.vue'));
const ReportLabPage = defineAsyncComponent(() => import('./ReportLabPage.vue'));
const ReportQualityPage = defineAsyncComponent(() => import('./ReportQualityPage.vue'));
const ReportInfectionPage = defineAsyncComponent(() => import('./ReportInfectionPage.vue'));
const ReportWarningPage = defineAsyncComponent(() => import('./ReportWarningPage.vue'));
const ReportFeePage = defineAsyncComponent(() => import('./ReportFeePage.vue'));
const ReportCampusPage = defineAsyncComponent(() => import('./ReportCampusPage.vue'));
const InfectionControlPage = defineAsyncComponent(() => import('./InfectionControlPage.vue'));
const InfectionCheckPage = defineAsyncComponent(() => import('./InfectionCheckPage.vue'));
const InfectionRegisterPage = defineAsyncComponent(() => import('./InfectionRegisterPage.vue'));
const InfectionPolicyPage = defineAsyncComponent(() => import('./InfectionPolicyPage.vue'));
const InfectionTrainingPage = defineAsyncComponent(() => import('./InfectionTrainingPage.vue'));
const InfectionReportPage = defineAsyncComponent(() => import('./InfectionReportPage.vue'));
const IntegrationDevicePage = defineAsyncComponent(() => import('./IntegrationDevicePage.vue'));
const IntegrationHospitalPage = defineAsyncComponent(() => import('./IntegrationHospitalPage.vue'));
const IntegrationReceptionPage = defineAsyncComponent(() => import('./IntegrationReceptionPage.vue'));
const IntegrationDialysisPage = defineAsyncComponent(() => import('./IntegrationDialysisPage.vue'));
const IntegrationSyncPage = defineAsyncComponent(() => import('./IntegrationSyncPage.vue'));
const CrcResearchPage = defineAsyncComponent(() => import('./CrcResearchPage.vue'));
const CrcProjectPage = defineAsyncComponent(() => import('./CrcProjectPage.vue'));
const CrcScreenPage = defineAsyncComponent(() => import('./CrcScreenPage.vue'));
const CrcSoaPage = defineAsyncComponent(() => import('./CrcSoaPage.vue'));
const CrcVisitPage = defineAsyncComponent(() => import('./CrcVisitPage.vue'));
const CrcAePage = defineAsyncComponent(() => import('./CrcAePage.vue'));
const CrcDrugPage = defineAsyncComponent(() => import('./CrcDrugPage.vue'));
const CrcSpecimenPage = defineAsyncComponent(() => import('./CrcSpecimenPage.vue'));
const CrcQueryPage = defineAsyncComponent(() => import('./CrcQueryPage.vue'));
const CrcAuditPage = defineAsyncComponent(() => import('./CrcAuditPage.vue'));
const CrcExportPage = defineAsyncComponent(() => import('./CrcExportPage.vue'));
const SystemAdminPage = defineAsyncComponent(() => import('./SystemAdminPage.vue'));
const SystemUserPage = defineAsyncComponent(() => import('./SystemUserPage.vue'));
const SystemRolePage = defineAsyncComponent(() => import('./SystemRolePage.vue'));
const SystemOrgPage = defineAsyncComponent(() => import('./SystemOrgPage.vue'));
const SystemDictPage = defineAsyncComponent(() => import('./SystemDictPage.vue'));
const SystemMenuPage = defineAsyncComponent(() => import('./SystemMenuPage.vue'));
const SystemMessagePage = defineAsyncComponent(() => import('./SystemMessagePage.vue'));
const SystemLogPage = defineAsyncComponent(() => import('./SystemLogPage.vue'));
const SystemParamPage = defineAsyncComponent(() => import('./SystemParamPage.vue'));
const SystemBackupPage = defineAsyncComponent(() => import('./SystemBackupPage.vue'));
const SystemMonitorPage = defineAsyncComponent(() => import('./SystemMonitorPage.vue'));

const menuPageMap: Record<string, unknown> = {
  'board-home': DepartmentDashboard,
  'board-today': BoardTodayPage,
  'board-warning': BoardWarningPage,
  'board-task': BoardTaskPage,
  'board-device': BoardDevicePage,

  'employee-task': EmployeeHomePage,
  'employee-message': EmployeeHomePage,
  'employee-sign': EmployeeHomePage,
  'employee-warning': EmployeeHomePage,
  'employee-log': EmployeeHomePage,
  'employee-duty': EmployeeHomePage,
  'employee-profile': EmployeeHomePage,

  'guide-home': GuideDeskPage,
  'guide-patient': GuidePatientPage,
  'guide-admission': GuideAdmissionPage,
  'guide-contract': GuideContractPage,
  'guide-follow-name': GuideFollowNamePage,
  'guide-owner': GuideAssignmentPage,
  'guide-appointment': GuideAppointmentPage,
  'guide-schedule': SchedulePreparationPage,
  'guide-checkin': SchedulePreparationPage,
  'guide-consent': GuideConsentPage,
  'guide-share': GuideSharePage,

  'doctor-home': DoctorClinicalPage,
  'doctor-my': DoctorPatientsPage,
  'doctor-log': DoctorLogPage,
  'doctor-order': DoctorOrderPage,
  'doctor-record': DoctorRecordPage,
  'doctor-diagnosis': DoctorDiagnosisPage,
  'doctor-common-assess': DoctorCommonAssessmentPage,
  'doctor-special-assess': DoctorSpecialAssessmentPage,
  'doctor-access': DoctorAccessPage,
  'doctor-lab': DoctorLabPage,
  'doctor-consent': DoctorConsentPage,
  'doctor-report': DoctorReportPage,
  'doctor-apply': DoctorApplyPage,
  'doctor-message': DoctorMessagePage,
  'doctor-event': DoctorEventPage,
  'doctor-quality': QualityCqiPage,
  'doctor-share': DoctorSharePage,

  'nurse-home': NurseExecutionPage,
  'nurse-patient': NursePatientPage,
  'nurse-log': NurseLogPage,
  'nurse-check': NurseReviewPage,
  'nurse-execute': NurseExecutePage,
  'nurse-record': NurseRecordPage,
  'nurse-message': NurseMessagePage,
  'nurse-treatment': TreatmentSessionPage,
  'nurse-archive': TreatmentArchivePage,
  'nurse-access': NurseAccessPage,
  'nurse-specimen': NurseSpecimenPage,
  'nurse-common-assess': NurseAssessmentPage,
  'nurse-special-assess': NurseSpecialAssessmentPage,
  'nurse-lab': NurseLabPage,
  'nurse-refund': NurseRefundPage,
  'nurse-education': NurseEducationPage,
  'nurse-event': NurseEventPage,
  'nurse-quality': NurseQualityPage,

  'lab-log': LabLogPage,
  'lab-order': LabOrderPage,
  'lab-specimen': LabSpecimenPage,
  'lab-execute': LabExecutePage,
  'lab-input': LabInputPage,
  'lab-result': LabResultPage,
  'lab-quality': LabQualityPage,

  'pharmacy-log': PharmacyLogPage,
  'pharmacy-audit': PharmacyAuditPage,
  'pharmacy-execute': PharmacyExecutePage,
  'pharmacy-dispense': PharmacyDispensePage,
  'pharmacy-drug': PharmacyDrugPage,
  'pharmacy-gcp': PharmacyGcpPage,

  'stock-drug-io': StockDrugIoPage,
  'stock-drug-warning': StockDrugWarningPage,
  'stock-drug-use': StockDrugUsePage,
  'stock-material-io': StockMaterialIoPage,
  'stock-material-warning': StockMaterialWarningPage,
  'stock-material-use': StockMaterialUsePage,
  'stock-fee': StockFeeManagePage,

  'device-home': DeviceHomePage,
  'device-bed': DeviceBedPage,
  'device-zone': DeviceZonePage,
  'device-bind': DeviceBindPage,
  'device-archive': DeviceArchivePage,
  'device-record': DeviceRecordPage,
  'device-monitor': DeviceMonitorPage,
  'device-water': DeviceWaterManagePage,
  'device-quality': DeviceQualityPage,

  'medical-duty': MedicalDutyPage,
  'medical-nurse-group': MedicalNurseGroupPage,
  'medical-resource': MedicalResourcePage,
  'medical-team': MedicalTeamPage,
  'medical-dynamic': MedicalDynamicPage,
  'medical-assignment': MedicalAssignmentPage,

  'hr-staff': HrStaffPage,
  'hr-profile': HrProfilePage,
  'hr-work': HrWorkPage,
  'hr-education': HrEducationPage,
  'hr-gcp': HrGcpPage,
  'hr-social': HrSocialPage,
  'hr-research': HrResearchPage,
  'hr-certificate': HrCertificatePage,

  'home-log': HomeLogPage,
  'home-treatment': HomeTreatmentPage,
  'home-team': HomeTeamPage,
  'home-health': HomeHealthPage,
  'home-common-assess': HomeAssessmentPage,
  'home-special-assess': HomeAssessmentPage,
  'home-upload': HomeUploadPage,
  'home-event': HomeEventPage,
  'home-patient': HomePatientPage,
  'home-contract': HomeContractPage,
  'home-consent': HomeConsentPage,

  'base-medical-dict': BaseMedicalDictPage,
  'base-order': BaseOrderPage,
  'base-drug': BaseDrugPage,
  'base-material': BaseMaterialPage,
  'base-fee': BaseFeePage,
  'base-lab': BaseLabPage,
  'base-dialysis': BaseDialysisPage,
  'base-template': BaseTemplatePage,

  'rule-diagnosis': RuleDiagnosisPage,
  'rule-task': RuleTaskPage,
  'rule-message': RuleMessagePage,
  'rule-effect': RuleEffectPage,
  'rule-warning': RuleWarningPage,
  'rule-cqi': RuleCqiPage,
  'rule-flow': RuleFlowPage,

  'report-patient': ReportPatientPage,
  'report-dialysis': ReportDialysisPage,
  'report-bed': ReportBedPage,
  'report-lab': ReportLabPage,
  'report-quality': ReportQualityPage,
  'report-infection': ReportInfectionPage,
  'report-warning': ReportWarningPage,
  'report-fee': ReportFeePage,
  'report-campus': ReportCampusPage,

  'infection-check': InfectionCheckPage,
  'infection-register': InfectionRegisterPage,
  'infection-policy': InfectionPolicyPage,
  'infection-training': InfectionTrainingPage,
  'infection-report': InfectionReportPage,

  'integration-overview': IntegrationDevicePage,
  'integration-hospital': IntegrationHospitalPage,
  'integration-reception': IntegrationReceptionPage,
  'integration-dialysis': IntegrationDialysisPage,
  'integration-sync': IntegrationSyncPage,

  'crc-project': CrcProjectPage,
  'crc-screen': CrcScreenPage,
  'crc-soa': CrcSoaPage,
  'crc-visit': CrcVisitPage,
  'crc-ae': CrcAePage,
  'crc-drug': CrcDrugPage,
  'crc-specimen': CrcSpecimenPage,
  'crc-query': CrcQueryPage,
  'crc-audit': CrcAuditPage,
  'crc-export': CrcExportPage,

  'system-user': SystemUserPage,
  'system-role': SystemRolePage,
  'system-org': SystemOrgPage,
  'system-dict': SystemDictPage,
  'system-menu': SystemMenuPage,
  'system-message': SystemMessagePage,
  'system-log': SystemLogPage,
  'system-param': SystemParamPage,
  'system-backup': SystemBackupPage,
  'system-monitor': SystemMonitorPage,
};

const activePageComponent = computed(() => menuPageMap[props.context.menuKey] ?? ChronicPrototypePage);
</script>

<template>
  <component :is="activePageComponent" :context="context" />
</template>
