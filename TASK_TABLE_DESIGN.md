# 血液净化专科系统任务表结构设计

本文件根据 `血液净化专科系统原型功能清单.docx`、业务闭环任务清单和主流医疗信息模型整理。后续开发某个 Task 前，先查本文件对应任务的表结构、输入输出和闭环校验。

## 参考模型

- HL7 FHIR：参考 Patient、Encounter、Observation、ServiceRequest、MedicationRequest、DiagnosticReport、Task、DeviceMetric、AuditEvent 等资源设计。核心思想是“请求/医嘱 -> 执行任务 -> 临床记录/报告 -> 审计追溯”。
- OpenMRS：参考 Visit、Encounter、Obs、Order、Provider、Location 模型。核心思想是一次患者就医过程包含多个 Encounter，临床数据以 Observation 结构化沉淀。
- 医院主流 HIS/EMR/LIS/透析系统做法：患者主索引、就诊/治疗事件、医嘱、执行、检验报告、设备采集、药耗费用、审计日志分层存储。

## 通用字段约定

所有业务表默认包含：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | varchar(36) | 主键，UUID |
| tenant_id | varchar(36) | 医疗集团/租户 |
| org_id | varchar(36) | 医院/中心 |
| campus_id | varchar(36) | 院区 |
| dept_id | varchar(36) | 科室/血透中心 |
| status | varchar(32) | 草稿、待审、有效、停用、归档等 |
| created_by / created_at | varchar(36) / datetime | 创建人和时间 |
| updated_by / updated_at | varchar(36) / datetime | 更新人和时间 |
| deleted_flag | tinyint | 软删除 |
| version | int | 乐观锁/历史版本 |

高风险、审核、执行、归档类表额外包含：`submitted_at`、`reviewed_by`、`reviewed_at`、`review_result`、`signed_by`、`signed_at`、`archived_at`、`audit_trace_id`。

## 核心主数据表

### 系统与权限

| 表名 | 关键字段 | 用途 |
| --- | --- | --- |
| sys_organization | parent_id, org_type, org_code, org_name, license_no | 医院、院区、中心、科室层级 |
| sys_user | employee_no, login_name, phone, password_hash, user_type, locked_until | 登录账号 |
| sys_role | role_code, role_name, role_scope, data_scope | 角色 |
| sys_user_role | user_id, role_id, valid_from, valid_to | 用户角色 |
| sys_work_identity | user_id, org_id, dept_id, business_domain, specialty, workstation_code, role_id, is_default | 登录后的工作身份 |
| sys_workstation | workstation_code, workstation_name, phase, enabled | 工作站入口 |
| sys_menu | menu_code, parent_id, menu_name, route_path, component_key, workstation_code, sort_no | 工作站菜单 |
| sys_permission | permission_code, resource_type, resource_code, action_code | 按钮/数据/菜单权限 |
| sys_role_permission | role_id, permission_id | 角色权限 |
| sys_audit_log | user_id, identity_id, action_type, entity_type, entity_id, before_json, after_json, ip, result | 登录、修改、审核、归档等审计 |

### 基础数据

| 表名 | 关键字段 | 用途 |
| --- | --- | --- |
| base_dict | dict_code, dict_name, dict_domain | 通用字典 |
| base_dict_item | dict_id, item_code, item_name, sort_no, enabled | 字典项 |
| base_diagnosis | diagnosis_code, diagnosis_name, icd_code, diagnosis_type, enabled | 诊断字典 |
| base_order_item | order_code, order_name, order_type, execute_role, billing_flag, stock_item_id | 医嘱项目 |
| base_order_set | set_code, set_name, scope, owner_user_id, specialty | 医嘱组套 |
| base_order_set_item | set_id, order_item_id, dosage, frequency, route, default_duration | 组套明细 |
| base_drug | drug_code, generic_name, trade_name, spec, dose_unit, package_unit, insurance_type, stock_enabled | 药品资料 |
| base_material | material_code, material_name, category, spec, manufacturer, registration_no, high_value_flag, lot_control | 耗材资料 |
| base_fee_item | fee_code, fee_name, fee_type, price, unit, insurance_code, enabled | 收费项目 |
| base_lab_item | lab_code, lab_name, unit, normal_low, normal_high, critical_low, critical_high, standard_code | 检验项目 |
| base_dialysis_mode | mode_code, mode_name, default_duration, anticoagulation_options, fee_item_id | 透析模式 |
| base_template | template_code, template_type, template_name, content_json, enabled | 病历、评估、宣教、知情同意模板 |

### 患者与治疗主线

| 表名 | 关键字段 | 用途 |
| --- | --- | --- |
| patient_master | patient_no, name, gender, birth_date, id_card_no, phone, face_id, current_status | 患者主索引 |
| patient_contact | patient_id, contact_name, relation, phone, address, is_primary | 联系人 |
| patient_insurance | patient_id, insurance_type, insurance_no, valid_from, valid_to | 医保信息 |
| patient_contract | patient_id, contract_type, service_package, start_date, end_date, contract_status | 签约续约解约 |
| patient_follow_alias | patient_id, alias_name, alias_status, start_date, end_date | 随访名称 |
| patient_assignment | patient_id, follow_org_id, follow_dept_id, care_team_id, doctor_id, nurse_id, nursing_group_id, bed_id, active_flag | 归属责任分配 |
| patient_consent | patient_id, consent_type, signed_status, signed_at, attachment_id | 知情同意书 |
| clinical_encounter | patient_id, encounter_type, encounter_time, provider_id, location_id, source_task_id | 就诊/评估/治疗上下文 |
| clinical_observation | encounter_id, patient_id, obs_code, obs_name, value_type, value_num, value_text, unit, obs_time | 结构化观察值 |

## Task 用表设计与闭环判断

### Task 0 登录与身份

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| sys_user | login_name, password_hash, phone, locked_until | 登录认证 |
| sys_work_identity | user_id, workstation_code, role_id, is_default | 身份选择 |
| sys_workstation / sys_menu | workstation_code, route_path | 加载工作站和菜单 |
| sys_audit_log | action_type=login/switch_identity, result | 登录和切换身份留痕 |

闭环：账号登录 -> 选择身份 -> 加载工作站 -> 写入登录/身份切换日志。

### Task 1 科室看板

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| dialysis_schedule | treatment_date, shift_code, bed_id, patient_id, schedule_status | 今日排班来源 |
| treatment_session | schedule_id, patient_id, treatment_status, start_time, end_time | 治疗进度 |
| alert_event | alert_type, severity, owner_role, close_status | 预警危急值 |
| device_metric_record / water_quality_record | device_id, metric_code, value, result_status | 设备水质 |
| workflow_task | task_type, assignee_role, due_time, task_status | 待办汇总 |

闭环：看板指标必须能跳到排班、治疗、预警、设备或待办处理页面。

### Task 2 系统管理与权限

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| sys_organization | parent_id, org_type, org_name | 组织权限边界 |
| sys_user / sys_role / sys_permission | user_id, role_id, permission_code | 账号角色权限 |
| sys_work_identity | user_id, dept_id, specialty, workstation_code | 身份与工作站 |
| sys_menu / sys_role_permission | menu_code, role_id | 菜单控制 |
| sys_audit_log | entity_type, entity_id, before_json, after_json | 权限变更可追溯 |

闭环：新增用户 -> 分配身份和角色 -> 授权菜单 -> 登录可见 -> 审计可查。

### Task 3 基础数据中心

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| base_diagnosis | diagnosis_code, icd_code | 诊断统一 |
| base_order_item / base_order_set | order_type, execute_role | 医嘱统一 |
| base_drug / base_material | lot_control, stock_enabled | 药耗统一 |
| base_fee_item | fee_code, price | 费用统一 |
| base_lab_item | normal_range, critical_range | 检验判断统一 |
| base_dialysis_mode / base_template | default_duration, content_json | 处方和文书模板 |

闭环：业务页面只引用基础数据，不在页面内自造项目、价格或规则。

### Task 4 医务医事与资源

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| staff_profile | user_id, staff_no, professional_title, qualification_status | 人员基础 |
| duty_schedule | staff_id, duty_date, shift_code, role_type | 值班排班 |
| nursing_group | group_name, leader_id, enabled | 护理组 |
| care_team | team_name, chief_doctor_id, service_scope | 专家团队 |
| care_team_member | team_id, staff_id, team_role | 团队成员 |
| bed_station | bed_code, zone_id, bed_type, enabled | 机位资源 |
| patient_assignment | doctor_id, nurse_id, nursing_group_id, bed_id | 分管关系 |

闭环：人员/团队/机位资源 -> 患者归属 -> 排班 -> 工作量统计。

### Task 5 员工主页

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| workflow_task | task_type, source_entity_type, source_entity_id, assignee_user_id, task_status | 我的任务 |
| system_message | receiver_id, message_type, title, read_status | 我的消息 |
| electronic_signature | user_id, sign_type, cert_status, last_used_at | 签名入口 |
| patient_assignment | doctor_id, nurse_id | 我的患者 |
| staff_profile | user_id, qualification_status | 员工资料 |

闭环：各业务模块生成任务 -> 员工主页处理 -> 回写业务状态。

### Task 6 导诊建档签约

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| patient_master | patient_no, name, id_card_no, current_status | 患者主档 |
| patient_contact | relation, phone, address | 家属联系人 |
| patient_insurance | insurance_type, insurance_no | 医保 |
| patient_contract | service_package, contract_status | 签约状态 |
| patient_follow_alias | alias_name, alias_status | 随访名称 |
| patient_exit_record | patient_id, exit_reason, exit_date | 退出记录 |

闭环：建档并签约后，患者才进入归属分配、预约和治疗流程。

### Task 7 归属分配预约

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| patient_assignment | doctor_id, nurse_id, nursing_group_id, bed_id | 责任归属 |
| service_request | patient_id, request_type, requested_time, request_status | 治疗/手术/随访申请 |
| appointment | service_request_id, appointment_time, appointment_status | 预约 |
| appointment_review | appointment_id, reviewer_id, review_result | 预约审核 |
| assignment_change_log | patient_id, from_owner, to_owner, reason | 归属变更追溯 |

闭环：申请 -> 审核 -> 预约 -> 责任人可见 -> 排班引用。

### Task 8 排班排床签到准备

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| bed_zone | zone_name, infection_type, clean_level | 分区隔离 |
| bed_station | zone_id, bed_code, bed_type, device_id | 机位 |
| dialysis_schedule | patient_id, treatment_date, shift_code, bed_id, dialysis_mode, schedule_status | 排班 |
| schedule_change_log | schedule_id, change_type, reason | 调床/换班追溯 |
| checkin_record | schedule_id, patient_id, checkin_time, checkin_method, checkin_status | 签到 |

闭环：预约患者 -> 排班排床 -> 签到/缺席/补透 -> 生成当日治疗记录。

### Task 9 血管通路

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| vascular_access | patient_id, access_type, body_site, created_date, current_status, use_status | 通路档案 |
| vascular_access_operation | access_id, operation_type, operation_date, operator_id | 建立/置管/手术 |
| vascular_access_enable | access_id, enable_date, first_use_date, evaluation_result | 启用 |
| vascular_access_assessment | access_id, assessment_type, flow_value, infection_sign, risk_level | 评估 |
| puncture_record | access_id, treatment_session_id, arterial_site, venous_site, puncture_method | 穿刺 |
| vascular_access_event | access_id, event_type, severity, treatment_result | 通路事件 |
| vascular_access_timeline | access_id, event_time, event_type, ref_entity_id | 时间轴 |

闭环：通路状态影响处方、上机核对、穿刺和风险预警。

### Task 10 医生诊疗基础

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| medical_record | patient_id, record_type, content_json, signed_status | 病历病程 |
| patient_diagnosis | patient_id, diagnosis_id, diagnosis_stage, active_flag | 诊断 |
| clinical_assessment | patient_id, assessment_type, form_json, conclusion, risk_level | 常见/专科评估 |
| clinical_event | patient_id, event_type, event_date, severity | 临床事件 |
| patient_consent | consent_type, signed_status | 知情同意 |
| health_report | patient_id, report_period, conclusion, archived_at | 健康报告 |

闭环：诊断评估和同意书状态作为医嘱处方、预警、治疗准入依据。

### Task 11 医嘱与透析处方

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| medical_order | patient_id, encounter_id, order_type, order_item_id, order_status, review_status | 医嘱主表 |
| medical_order_detail | order_id, dosage, frequency, route, start_time, stop_time | 医嘱明细 |
| dialysis_prescription | patient_id, access_id, mode_id, duration, blood_flow, dialysate_flow, anticoagulation | 透析处方 |
| order_review_log | order_id, reviewer_id, review_result, review_opinion | 审核 |
| order_execution_plan | order_id, execute_role, planned_time, execute_status | 执行计划 |

闭环：医嘱/处方 -> 护士核对执行 -> 治疗记录 -> 药耗费用。

### Task 12 护士核对执行

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| nursing_review | patient_id, ref_entity_type, ref_entity_id, review_result | 护理审核 |
| order_execution | order_id, executor_id, execute_time, execute_result, exception_flag | 医嘱执行 |
| double_check_record | ref_entity_type, ref_entity_id, checker1_id, checker2_id, check_result | 双人核对 |
| nursing_record | patient_id, treatment_session_id, record_type, content_json | 护理记录 |
| execution_correction | execution_id, reason, before_json, after_json, approved_by | 勘误 |

闭环：审核/核对/执行结果必须写入治疗记录并可追溯。

### Task 13 透析治疗过程

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| treatment_session | schedule_id, patient_id, prescription_id, device_id, treatment_status | 单次治疗 |
| pre_treatment_assessment | session_id, weight, bp, temperature, access_status, risk_flag | 透前评估 |
| machine_check_record | session_id, device_id, access_id, check_result | 上机核对 |
| treatment_parameter | session_id, param_code, value, unit, record_time | 透析参数 |
| treatment_vital_sign | session_id, bp, pulse, temperature, record_time | 透中监测 |
| treatment_symptom_event | session_id, symptom_type, severity, handle_measure, outcome | 症状处理 |
| post_treatment_assessment | session_id, post_weight, bp, access_bleeding, leave_status | 透后评估 |

闭环：治疗过程完整后，才能进入小结、签名和归档。

### Task 14 治疗记录归档

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| treatment_summary | session_id, adequacy_summary, complications, doctor_advice | 治疗小结 |
| disinfection_record | session_id, device_id, disinfect_method, operator_id, result | 消毒 |
| dialysis_record_sheet | session_id, sheet_no, generated_at, print_status | 记录单 |
| signature_record | ref_entity_type, ref_entity_id, signer_role, signer_id, signed_at | 签名 |
| archive_review | ref_entity_type, ref_entity_id, review_result, archived_at | 审核归档 |
| record_version_history | ref_entity_type, ref_entity_id, version_no, diff_json | 历史版本 |

闭环：归档数据供质控、报表、费用、患者端查询和审计使用。

### Task 15 药耗费用

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| stock_lot | item_type, item_id, lot_no, expire_date, quantity, warehouse_id | 批号库存 |
| stock_transaction | item_type, item_id, lot_id, trans_type, quantity, ref_entity_id | 库存流水 |
| medication_consumption | patient_id, session_id, order_id, drug_id, lot_id, quantity | 药品消耗 |
| material_consumption | patient_id, session_id, material_id, lot_id, quantity | 耗材消耗 |
| charge_detail | patient_id, session_id, fee_item_id, amount, charge_status | 费用明细 |
| patient_account_balance | patient_id, balance, arrears_flag | 余额欠费 |

闭环：治疗过程消耗 -> 库存扣减 -> 费用生成 -> 可按批号追溯。

### Task 16 检验闭环

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| lab_order | patient_id, order_id, lab_status, requested_at | 检验医嘱 |
| specimen_record | lab_order_id, specimen_type, collect_time, receive_time, specimen_status | 标本 |
| lab_report | patient_id, lab_order_id, report_no, report_status, issued_at | 报告 |
| lab_result_item | report_id, lab_item_id, result_value, unit, abnormal_flag, critical_flag | 结果项 |
| critical_value_record | result_item_id, notify_time, receiver_id, handle_status | 危急值 |
| lab_report_attachment | report_id, file_id, source_type | 原始报告 |

闭环：结果录入/同步 -> 复核 -> 危急值通知 -> 医生处理 -> 报告归档。

### Task 17 设备水质闭环

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| device_archive | device_code, device_type, brand, model, enabled, location_id | 设备档案 |
| device_bed_binding | device_id, bed_id, bind_status, start_time, end_time | 设备机位绑定 |
| device_inspection | device_id, inspection_type, result, inspector_id | 巡检 |
| device_repair | device_id, fault_desc, repair_status, repair_result | 报修维修 |
| device_disinfection | device_id, disinfect_method, result, operator_id | 消毒 |
| device_metric_record | device_id, metric_code, value, unit, collect_time, result_status | 运行参数 |
| water_quality_record | system_id, metric_code, value, unit, collect_time, result_status | 水质 |
| device_alert | device_id, alert_type, severity, close_status | 设备水质异常 |

闭环：设备/水质异常 -> 看板预警 -> 维修复核 -> 影响上机放行。

### Task 18 疗效预警 CQI

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| alert_event | patient_id, alert_type, severity, source_entity_id, close_status | 预警 |
| alert_handle_record | alert_id, handler_id, handle_measure, handle_result | 处理 |
| efficacy_evaluation | patient_id, period, indicator_code, value, target_status | 疗效评估 |
| cqi_project | cqi_code, cqi_title, problem_desc, status | CQI项目 |
| cqi_action | cqi_id, action_desc, owner_id, due_date, action_status | 整改措施 |
| cqi_review | cqi_id, review_result, review_at | 复查 |

闭环：指标不达标 -> 预警 -> 处理/CQI -> 复查 -> 关闭。

### Task 19 感控管理

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| infection_check | check_type, checker_id, checked_user_id, check_time, result | 感控检查 |
| infection_issue | check_id, issue_type, severity, rectification_status | 不合格项 |
| infection_rectification | issue_id, measure, owner_id, due_date, review_result | 整改 |
| infection_policy | policy_title, version_no, effective_date | 制度 |
| infection_training | training_title, training_date, trainer_id | 培训 |
| infection_training_attendance | training_id, staff_id, sign_status, test_score | 培训签到测试 |

闭环：检查发现问题 -> 整改 -> 复核 -> 统计与培训改进。

### Task 20 统计报表

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| report_metric_def | metric_code, metric_name, source_table, calculation_rule | 指标定义 |
| report_snapshot | report_type, period_start, period_end, generated_at | 报表快照 |
| report_metric_value | snapshot_id, metric_code, dimension_json, metric_value | 指标值 |
| report_drill_link | metric_value_id, source_entity_type, source_entity_id | 指标追溯 |

闭环：报表指标必须能下钻到患者、治疗、检验、设备、费用或预警原始记录。

### Task 21 规则配置

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| rule_plan | rule_code, rule_type, rule_name, enabled | 规则方案 |
| rule_condition | rule_id, source_field, operator, compare_value | 条件 |
| rule_action | rule_id, action_type, target_role, message_template_id | 动作 |
| rule_execution_log | rule_id, source_entity_id, execute_result, execute_at | 执行日志 |
| reminder_rule | trigger_type, due_offset, target_role, enabled | 提醒 |

闭环：业务数据触发规则 -> 生成提醒/预警/任务 -> 处理结果回写。

### Task 22 接口设备集成

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| integration_endpoint | system_code, endpoint_type, url, enabled | 接口配置 |
| integration_mapping | system_code, local_code, external_code, mapping_type | 字典映射 |
| integration_sync_log | endpoint_id, sync_type, ref_entity_id, sync_status, error_msg | 同步日志 |
| device_gateway | gateway_code, protocol, ip_address, online_status | 设备网关 |
| device_raw_data | device_id, session_id, raw_payload, collect_time, parse_status | 原始采集 |
| device_parsed_data | raw_id, metric_code, value, unit, result_status | 解析结果 |

闭环：接口同步/设备采集失败必须可重试、人工处理和审计。

### Task 23 药房站

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| pharmacy_review | order_id, pharmacist_id, review_result, review_opinion | 药师审核 |
| pharmacy_dispense | order_id, drug_id, quantity, dispense_status | 发药 |
| pharmacy_return | dispense_id, return_quantity, return_reason | 退药 |
| drug_contraindication_alert | patient_id, drug_id, alert_reason, handle_status | 禁忌提示 |
| gcp_drug_record | project_id, drug_id, action_type, temperature, operator_id | GCP药物 |

闭环：医嘱 -> 药师审核 -> 发药/退药 -> 库存和费用更新。

### Task 24 居家个人主页

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| patient_portal_account | patient_id, login_phone, account_status | 患者端账号 |
| home_task | patient_id, task_type, due_date, task_status | 居家待办 |
| home_assessment | patient_id, assessment_type, value_json, submit_status | 居家评估 |
| home_lab_upload | patient_id, file_id, recognize_status, review_status | 检验上传 |
| home_request | patient_id, request_type, request_status, review_result | 签约/变更申请 |
| online_consent_signature | patient_id, consent_id, sign_method, signed_at | 在线签署 |

闭环：患者端提交 -> 医护审核 -> 进入患者档案/检验/随访任务。

### Task 25 行政人事站

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| staff_profile | user_id, staff_no, name, title, qualification_status | 员工档案 |
| staff_employment_record | staff_id, action_type, effective_date, status | 入离退休返聘 |
| staff_position_record | staff_id, position_name, start_date, end_date | 任职 |
| staff_education_record | staff_id, school, degree, start_date, end_date | 学习经历 |
| staff_training_record | staff_id, training_type, training_date, certificate_id | 培训 |
| staff_certificate | staff_id, certificate_type, certificate_no, expire_date | 证件证书 |
| staff_research_record | staff_id, research_type, title, publish_date | 科研 |

闭环：人员资质影响排班、授权、签名和GCP角色资格。

### Task 26 CRC站

| 表名 | 关键字段 | 闭环作用 |
| --- | --- | --- |
| crc_project | project_code, project_name, sponsor, project_status | 项目 |
| crc_project_member | project_id, staff_id, research_role | 研究团队 |
| crc_subject | project_id, patient_id, subject_no, subject_status | 受试者 |
| crc_screening | subject_id, inclusion_result, exclusion_result, screening_status | 筛选 |
| crc_visit_plan | project_id, visit_code, window_start, window_end | SoA |
| crc_visit_record | subject_id, visit_plan_id, visit_status, visit_date | 访视 |
| crc_ae_record | subject_id, ae_type, severity, relation, report_status | AE/SAE |
| crc_drug_accountability | project_id, drug_id, action_type, quantity, temperature | 研究药物 |
| crc_specimen_chain | subject_id, specimen_code, action_type, action_time | 标本链 |
| crc_query | subject_id, form_id, query_status, resolved_at | 数据核查 |
| crc_audit_trail | project_id, entity_type, entity_id, action_type, before_json, after_json | 审计 |

闭环：项目 -> 筛选入组 -> 访视 -> 药物/标本/AE -> 数据核查 -> 审计导出。
