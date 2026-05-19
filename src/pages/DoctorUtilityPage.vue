<script setup lang="ts">
import { computed, ref } from 'vue';
import { CircleCheck, Document, Message, Search, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{ context: PageContext }>();

type UtilityRow = {
  id: string;
  subject: string;
  patient: string;
  target: string;
  content: string;
  status: string;
  owner: string;
  time: string;
  nextAction: string;
};

const editDialogVisible = ref(false);
const reviewDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<UtilityRow | null>(null);

const pageMeta = computed(() => {
  const map: Record<string, { title: string; hint: string; primary: string }> = {
    'doctor-log': { title: '工作日志', hint: '记录医生每日诊疗、审核、处方调整、事件处理和跨团队协作事项。', primary: '新增日志' },
    'doctor-apply': { title: '向他科申请预约', hint: '向检验、影像、通路、心内、感控、营养等团队发起会诊或预约申请。', primary: '发起申请' },
    'doctor-message': { title: '留言板', hint: '处理患者、护士、导诊和药师留言，回复结果可回写患者端或工作日志。', primary: '回复留言' },
    'doctor-share': { title: '共享协管', hint: '为患者开通跨团队协管，限定数据范围、协管时限和责任人。', primary: '新增协管' },
  };
  return map[props.context.menuKey] ?? map['doctor-log'];
});

const rows = computed<UtilityRow[]>(() => {
  if (props.context.menuKey === 'doctor-apply') {
    return [
      { id: 'APP-001', subject: '通路超声预约', patient: '陈志强', target: '血管通路团队', content: '人工血管震颤稍弱，申请超声复查', status: '待审核', owner: '刘主任', time: '2026-05-10 08:30', nextAction: '通路团队确认' },
      { id: 'APP-002', subject: '心内会诊', patient: '周庆', target: '心内科', content: 'BNP高，透中低血压风险', status: '已预约', owner: '王主任', time: '2026-05-10 09:00', nextAction: '等待会诊' },
      { id: 'APP-003', subject: '营养随访', patient: '李秀兰', target: '营养师团队', content: '白蛋白偏低，需营养评估', status: '处理中', owner: '陈宁', time: '2026-05-10 09:20', nextAction: '营养师回复' },
      { id: 'APP-004', subject: '感控协查', patient: '赵明', target: '感控小组', content: '隔离透析风险复核', status: '已完成', owner: '张明', time: '2026-05-10 10:00', nextAction: '归档' },
      { id: 'APP-005', subject: '药师审核', patient: '何雪', target: '药房站', content: '降磷药调整适宜性审核', status: '待审核', owner: '刘主任', time: '2026-05-10 10:30', nextAction: '药师审核' },
      { id: 'APP-006', subject: '检验复查', patient: '郭强', target: '检验科', content: '透后复查Kt/V', status: '待采集', owner: '张明', time: '2026-05-10 11:00', nextAction: '护士采样' },
      { id: 'APP-007', subject: '影像检查', patient: '刘梅英', target: '影像科', content: '胸片复查', status: '退回修改', owner: '陈宁', time: '2026-05-10 11:20', nextAction: '补充申请' },
      { id: 'APP-008', subject: '急诊评估', patient: '陈志强', target: '急诊科', content: '临时透析前风险评估', status: '已完成', owner: '王主任', time: '2026-05-10 12:00', nextAction: '治疗准备' },
      { id: 'APP-009', subject: '医保咨询', patient: '郑军', target: '导诊台', content: '异地医保备案影响处方费用', status: '处理中', owner: '张明', time: '2026-05-10 13:00', nextAction: '导诊回复' },
      { id: 'APP-010', subject: 'CRC筛查', patient: '王建国', target: 'CRC站', content: '贫血项目筛选咨询', status: '待确认', owner: '刘主任', time: '2026-05-10 14:00', nextAction: '研究护士确认' },
    ];
  }
  if (props.context.menuKey === 'doctor-message') {
    return [
      { id: 'MSG-001', subject: '患者用药咨询', patient: '孙海', target: '患者端', content: '左卡尼汀是否每次透后使用', status: '待回复', owner: '刘主任', time: '2026-05-10 08:10', nextAction: '医生回复' },
      { id: 'MSG-002', subject: '护士核对疑问', patient: '周庆', target: '护士站', content: '本次超滤上限是否2.0L', status: '已回复', owner: '王主任', time: '2026-05-10 08:40', nextAction: '护理执行' },
      { id: 'MSG-003', subject: '导诊签约缺项', patient: '赵明', target: '导诊台', content: '高钾处理知情确认缺失', status: '待处理', owner: '张明', time: '2026-05-10 09:05', nextAction: '补签文书' },
      { id: 'MSG-004', subject: '药师退回', patient: '何雪', target: '药房站', content: '降磷药剂量需确认', status: '待回复', owner: '刘主任', time: '2026-05-10 09:30', nextAction: '调整医嘱' },
      { id: 'MSG-005', subject: '患者报告阅读', patient: '韩梅', target: '患者端', content: '健康报告已读确认', status: '已完成', owner: '刘主任', time: '2026-05-10 10:00', nextAction: '归档' },
      { id: 'MSG-006', subject: '感控提醒', patient: '李秀兰', target: '感控管理', content: '导管出口红肿需复查', status: '处理中', owner: '陈宁', time: '2026-05-10 10:30', nextAction: '事件处理' },
      { id: 'MSG-007', subject: '营养师建议', patient: '李秀兰', target: '营养师', content: '高蛋白饮食建议已生成', status: '已回复', owner: '陈宁', time: '2026-05-10 11:00', nextAction: '患者确认' },
      { id: 'MSG-008', subject: '护士签名请求', patient: '郭强', target: '护士站', content: '透后复查采样计划', status: '待确认', owner: '张明', time: '2026-05-10 11:30', nextAction: '确认计划' },
      { id: 'MSG-009', subject: '家属咨询', patient: '潘德胜', target: '患者端', content: '透后跌倒风险注意事项', status: '待回复', owner: '王主任', time: '2026-05-10 12:00', nextAction: '回复家属' },
      { id: 'MSG-010', subject: '设备放行提醒', patient: '赵明', target: '技师站', content: '隔离机位放行状态确认', status: '已完成', owner: '张明', time: '2026-05-10 13:00', nextAction: '排班引用' },
    ];
  }
  if (props.context.menuKey === 'doctor-share') {
    return [
      { id: 'SH-001', subject: '营养协管', patient: '李秀兰', target: '营养师团队', content: '共享检验趋势和居家饮食任务', status: '协管中', owner: '陈宁', time: '2026-05-10 09:20', nextAction: '营养随访' },
      { id: 'SH-002', subject: '感控协管', patient: '赵明', target: '感控小组', content: '隔离透析和感染标志共享', status: '协管中', owner: '张明', time: '2026-05-10 10:00', nextAction: '隔离复核' },
      { id: 'SH-003', subject: '通路协管', patient: '陈志强', target: '血管通路团队', content: '共享通路事件和影像申请', status: '待复核', owner: '刘主任', time: '2026-05-10 10:30', nextAction: '权限复核' },
      { id: 'SH-004', subject: '药师协管', patient: '何雪', target: '药房站', content: '共享诊断和检验结果用于用药审核', status: '协管中', owner: '刘主任', time: '2026-05-10 11:00', nextAction: '药师审核' },
      { id: 'SH-005', subject: '心内协管', patient: '周庆', target: '心内科', content: '共享心衰风险和低血压事件', status: '待复核', owner: '王主任', time: '2026-05-10 11:30', nextAction: '会诊确认' },
      { id: 'SH-006', subject: '检验协管', patient: '郭强', target: '检验科', content: '共享复查项目和采样计划', status: '协管中', owner: '张明', time: '2026-05-10 12:00', nextAction: '标本采集' },
      { id: 'SH-007', subject: '导诊协管', patient: '郑军', target: '导诊台', content: '共享医保资料和签约状态', status: '处理中', owner: '张明', time: '2026-05-10 13:00', nextAction: '医保核验' },
      { id: 'SH-008', subject: 'CRC协管', patient: '王建国', target: 'CRC站', content: '共享授权患者筛选资料', status: '待确认', owner: '刘主任', time: '2026-05-10 14:00', nextAction: '研究授权' },
      { id: 'SH-009', subject: '急诊协管', patient: '陈志强', target: '急诊科', content: '共享临时透析准入资料', status: '已完成', owner: '王主任', time: '2026-05-10 15:00', nextAction: '归档' },
      { id: 'SH-010', subject: '护士协管', patient: '潘德胜', target: '护士站', content: '跌倒风险宣教和家属陪同', status: '协管中', owner: '王主任', time: '2026-05-10 16:00', nextAction: '护理执行' },
    ];
  }
  return [
    { id: 'LOG-001', subject: '上午班查房', patient: '王建国等12人', target: '医生站', content: '完成上午班责任患者查房和处方准入检查', status: '已记录', owner: '刘主任', time: '2026-05-10 08:30', nextAction: '处方审核' },
    { id: 'LOG-002', subject: '危急值处理', patient: '赵明', target: '检验科/护士站', content: '血钾危急值确认，要求复查并调整处方', status: '处理中', owner: '张明', time: '2026-05-10 08:45', nextAction: '事件关闭' },
    { id: 'LOG-003', subject: '导管风险', patient: '李秀兰', target: '感控管理', content: '导管出口红肿，已发起感控协管', status: '待复核', owner: '陈宁', time: '2026-05-10 09:00', nextAction: '感控处理' },
    { id: 'LOG-004', subject: '处方调整', patient: '周庆', target: '护士站', content: '心衰风险限制超滤不超过2.0L', status: '已记录', owner: '王主任', time: '2026-05-10 09:30', nextAction: '护理执行' },
    { id: 'LOG-005', subject: '报告发布', patient: '孙海', target: '居家主页', content: '月度健康报告已发布', status: '已完成', owner: '刘主任', time: '2026-05-10 10:00', nextAction: '患者确认' },
    { id: 'LOG-006', subject: '药师协同', patient: '何雪', target: '药房站', content: '降磷药调整提交药师审核', status: '处理中', owner: '刘主任', time: '2026-05-10 10:30', nextAction: '药师回复' },
    { id: 'LOG-007', subject: '通路申请', patient: '陈志强', target: '血管通路团队', content: '人工血管震颤稍弱，申请通路超声', status: '待审核', owner: '刘主任', time: '2026-05-10 11:00', nextAction: '预约检查' },
    { id: 'LOG-008', subject: '隔离复核', patient: '马丽', target: '感控管理', content: '乙肝隔离透析标识复核', status: '已完成', owner: '张明', time: '2026-05-10 11:30', nextAction: '排班引用' },
    { id: 'LOG-009', subject: '充分性评估', patient: '郭强', target: '医嘱处方', content: 'Kt/V低，建议延长透析时长', status: '待签名', owner: '张明', time: '2026-05-10 12:00', nextAction: '病程签名' },
    { id: 'LOG-010', subject: '跌倒风险', patient: '潘德胜', target: '护士站', content: '透后离室前家属陪同宣教', status: '已记录', owner: '王主任', time: '2026-05-10 12:30', nextAction: '护理记录' },
  ];
});

const activeTables = computed(() => {
  if (props.context.menuKey === 'doctor-apply') return ['consult_apply', 'appointment_request', 'department_collaboration', 'sys_audit_log'];
  if (props.context.menuKey === 'doctor-message') return ['message_board', 'message_reply', 'home_message_log', 'sys_audit_log'];
  if (props.context.menuKey === 'doctor-share') return ['share_collaboration', 'patient_assignment', 'sys_permission_scope', 'sys_audit_log'];
  return ['doctor_work_log', 'clinical_event', 'medical_order', 'sys_audit_log'];
});

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value.includes('已') || value === '协管中') return 'success';
  if (value.includes('退回')) return 'danger';
  if (value.includes('待') || value.includes('中')) return 'warning';
  return 'info';
}

function openEdit(row?: UtilityRow): void {
  selected.value = row ?? rows.value[0];
  editDialogVisible.value = true;
}

function openReview(row: UtilityRow): void {
  selected.value = row;
  reviewDialogVisible.value = true;
}

function openTrace(row: UtilityRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="doctor-clinical-page">
    <el-card class="clinical-work-card" shadow="never">
      <template #header>
        <div class="clinical-header">
          <div>
            <h2>{{ pageMeta.title }}</h2>
            <p>{{ pageMeta.hint }}</p>
          </div>
          <div class="clinical-actions">
            <el-button type="primary" :icon="Document" @click="openEdit()">{{ pageMeta.primary }}</el-button>
            <el-button :icon="CircleCheck" @click="openReview(rows[0])">审核/确认</el-button>
            <el-button :icon="Message" @click="openTrace(rows[0])">追溯</el-button>
          </div>
        </div>
      </template>

      <el-form class="clinical-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="主题、患者、目标、内容、责任人" clearable /></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待审核" value="待审核" /><el-option label="处理中" value="处理中" /><el-option label="已完成" value="已完成" /><el-option label="协管中" value="协管中" /></el-select></el-form-item>
        <el-form-item label="时间"><el-date-picker type="date" placeholder="选择日期" /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="编号" width="105" fixed="left" />
        <el-table-column prop="subject" label="主题" min-width="150" />
        <el-table-column prop="patient" label="患者/范围" min-width="125" />
        <el-table-column prop="target" label="目标/来源" min-width="140" />
        <el-table-column prop="content" label="内容" min-width="260" />
        <el-table-column prop="status" label="状态" width="105"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="105" />
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openEdit(row)">处理</el-button><el-button link @click="openReview(row)">确认</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" :title="pageMeta.primary" width="660px">
      <el-form label-width="112px">
        <el-form-item label="主题"><el-input :model-value="selected?.subject" /></el-form-item>
        <el-form-item label="患者/范围"><el-input :model-value="selected?.patient" /></el-form-item>
        <el-form-item label="目标/来源"><el-input :model-value="selected?.target" /></el-form-item>
        <el-form-item label="内容"><el-input type="textarea" :rows="4" :model-value="selected?.content" /></el-form-item>
        <el-form-item label="下一步"><el-input :model-value="selected?.nextAction" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction(`${pageMeta.title}已保存`)">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="reviewDialogVisible" title="审核/确认" width="580px">
      <el-form label-width="100px">
        <el-form-item label="编号"><el-input :model-value="selected?.id" disabled /></el-form-item>
        <el-form-item label="处理结果"><el-radio-group model-value="done"><el-radio-button label="done">确认完成</el-radio-button><el-radio-button label="return">退回修改</el-radio-button><el-radio-button label="follow">继续跟进</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="意见"><el-input type="textarea" :rows="3" placeholder="记录处理结果、退回原因或继续跟进事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="reviewDialogVisible = false">取消</el-button><el-button type="primary" @click="reviewDialogVisible = false; submitAction('处理结果已确认')">提交</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="处理追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:30" type="primary">创建事项：{{ selected?.subject }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00">责任人处理并更新下一步</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:30" type="success">处理结果写入日志和审计</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
