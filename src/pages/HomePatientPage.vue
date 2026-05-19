<script setup lang="ts">
import { ref } from 'vue';
import { Camera, CircleCheck, DocumentAdd, Search, Upload } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type PatientInfoRow = {
  id: string;
  item: string;
  content: string;
  source: string;
  status: string;
  owner: string;
  updatedAt: string;
  nextAction: string;
};

const selected = ref<PatientInfoRow | null>(null);
const editDialogVisible = ref(false);
const materialDialogVisible = ref(false);
const faceDialogVisible = ref(false);
const portalDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows: PatientInfoRow[] = [
  { id: 'PI-001', item: '基本信息', content: '王建国，男，58岁，身份证已核验', source: '导诊台建档', status: '已确认', owner: '导诊王敏', updatedAt: '2026-05-10 08:42', nextAction: '持续维护' },
  { id: 'PI-002', item: '联系人', content: '王强，儿子，139****1001，紧急联系人', source: '患者端维护', status: '待复核', owner: '导诊王敏', updatedAt: '2026-05-15 09:00', nextAction: '导诊复核' },
  { id: 'PI-003', item: '地址', content: '上海市浦东新区张江路100号，居家随访地址', source: '患者端维护', status: '待复核', owner: '随访客服', updatedAt: '2026-05-15 09:10', nextAction: '地址确认' },
  { id: 'PI-004', item: '证件材料', content: '身份证正反面、医保凭证、门慢备案截图', source: '附件上传', status: '已上传', owner: '患者本人', updatedAt: '2026-05-15 09:20', nextAction: '导诊审核' },
  { id: 'PI-005', item: '人脸识别确认', content: '最近一次刷脸确认 2026-05-15 08:55', source: '接诊设备联机', status: '已通过', owner: '系统', updatedAt: '2026-05-15 08:55', nextAction: '签署可引用' },
  { id: 'PI-006', item: '个人主页创建', content: '居家账号 portal-WJG 已创建并绑定手机号', source: '系统管理/导诊台', status: '已创建', owner: '系统管理员', updatedAt: '2026-05-10 09:30', nextAction: '权限持续校验' },
  { id: 'PI-007', item: '医保信息', content: '职工医保，异地备案有效至 2026-12-31', source: '医保接口', status: '已确认', owner: '导诊王敏', updatedAt: '2026-05-12 10:10', nextAction: '费用引用' },
  { id: 'PI-008', item: '过敏史', content: '青霉素皮疹史，患者端补充待医生确认', source: '患者端维护', status: '待医生确认', owner: '刘主任', updatedAt: '2026-05-14 20:00', nextAction: '医嘱校验' },
  { id: 'PI-009', item: '家属授权', content: '王强可代签居家随访与报告上传确认', source: '知情同意书', status: '已归档', owner: '导诊王敏', updatedAt: '2026-05-10 10:00', nextAction: '签名引用' },
  { id: 'PI-010', item: '账号安全', content: '手机号登录 + 人脸校验，最近登录 2026-05-15 07:50', source: '系统日志', status: '正常', owner: '系统管理员', updatedAt: '2026-05-15 07:50', nextAction: '异常登录监测' },
];

const activeTables = ['patient_master', 'patient_contact', 'patient_address', 'patient_attachment', 'patient_portal_account', 'face_verify_record'];

function tagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  if (status.includes('已') || status === '正常') return 'success';
  if (status.includes('待')) return 'warning';
  if (status.includes('异常')) return 'danger';
  return 'info';
}

function openEdit(row: PatientInfoRow): void {
  selected.value = row;
  editDialogVisible.value = true;
}

function openMaterial(row: PatientInfoRow): void {
  selected.value = row;
  materialDialogVisible.value = true;
}

function openTrace(row: PatientInfoRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="home-patient-page">
    <el-card class="home-work-card" shadow="never">
      <template #header>
        <div class="home-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>患者端维护基本信息、联系人、地址、证件材料，并展示人脸识别确认和个人主页创建状态，敏感变更回流导诊复核。</p>
          </div>
          <div class="home-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit(rows[0])">维护基本信息</el-button>
            <el-button :icon="Upload" @click="openMaterial(rows[3])">上传证件材料</el-button>
            <el-button :icon="Camera" @click="faceDialogVisible = true">人脸确认</el-button>
            <el-button :icon="CircleCheck" @click="portalDialogVisible = true">主页创建</el-button>
          </div>
        </div>
      </template>

      <el-form class="home-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="姓名、联系人、地址、证件、账号" clearable /></el-form-item>
        <el-form-item label="资料类型"><el-select placeholder="全部资料" clearable><el-option label="基本信息" value="基本信息" /><el-option label="联系人" value="联系人" /><el-option label="地址" value="地址" /><el-option label="证件材料" value="证件材料" /><el-option label="人脸识别确认" value="人脸识别确认" /><el-option label="个人主页创建" value="个人主页创建" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待复核" value="待复核" /><el-option label="已确认" value="已确认" /><el-option label="已上传" value="已上传" /><el-option label="已创建" value="已创建" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="资料号" width="105" fixed="left" />
        <el-table-column prop="item" label="资料项" width="125" />
        <el-table-column prop="content" label="当前内容" min-width="260" />
        <el-table-column prop="source" label="来源" min-width="130" />
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="110" />
        <el-table-column prop="updatedAt" label="更新时间" width="150" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="235" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openEdit(row)">维护</el-button>
            <el-button link @click="openMaterial(row)">附件</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="患者基本资料维护" width="680px">
      <el-form label-width="110px">
        <el-form-item label="资料项"><el-input :model-value="selected?.item" disabled /></el-form-item>
        <el-form-item label="当前内容"><el-input type="textarea" :rows="2" :model-value="selected?.content" /></el-form-item>
        <el-form-item label="变更类型"><el-radio-group model-value="info"><el-radio-button label="info">基本信息</el-radio-button><el-radio-button label="contact">联系人</el-radio-button><el-radio-button label="address">地址</el-radio-button><el-radio-button label="allergy">过敏史</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="变更说明"><el-input type="textarea" :rows="3" placeholder="说明变更原因、证明材料和需要复核的内容" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editDialogVisible = false">取消</el-button><el-button type="primary" @click="editDialogVisible = false; submitAction('资料变更已提交复核')">提交变更</el-button></template>
    </el-dialog>

    <el-dialog v-model="materialDialogVisible" title="证件材料上传" width="650px">
      <el-form label-width="110px">
        <el-form-item label="资料项"><el-input :model-value="selected?.item" disabled /></el-form-item>
        <el-form-item label="材料类型"><el-select model-value="id"><el-option label="身份证/医保凭证" value="id" /><el-option label="门慢门特材料" value="insurance" /><el-option label="家属授权书" value="family" /><el-option label="其他证件" value="other" /></el-select></el-form-item>
        <el-form-item label="附件"><el-upload drag action="#"><div class="el-upload__text">上传证件照片、截图或纸质材料扫描件</div></el-upload></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="填写证件号码、有效期、材料来源和审核说明" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="materialDialogVisible = false">取消</el-button><el-button type="primary" @click="materialDialogVisible = false; submitAction('证件材料已上传，等待导诊审核')">提交材料</el-button></template>
    </el-dialog>

    <el-dialog v-model="faceDialogVisible" title="人脸识别确认" width="560px">
      <el-alert type="info" show-icon :closable="false" title="原型展示人脸确认流程，实际对接接诊设备或移动端活体检测。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="确认场景"><el-select model-value="portal"><el-option label="个人主页登录" value="portal" /><el-option label="知情同意签署" value="consent" /><el-option label="证件材料提交" value="attachment" /></el-select></el-form-item>
        <el-form-item label="确认结果"><el-radio-group model-value="pass"><el-radio-button label="pass">通过</el-radio-button><el-radio-button label="manual">转人工核验</el-radio-button></el-radio-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="faceDialogVisible = false">取消</el-button><el-button type="primary" @click="faceDialogVisible = false; submitAction('人脸确认结果已记录')">记录确认</el-button></template>
    </el-dialog>

    <el-dialog v-model="portalDialogVisible" title="个人主页创建" width="600px">
      <el-form label-width="110px">
        <el-form-item label="门户账号"><el-input model-value="portal-WJG" /></el-form-item>
        <el-form-item label="绑定手机号"><el-input model-value="138****6721" /></el-form-item>
        <el-form-item label="授权范围"><el-checkbox-group model-value="health"><el-checkbox-button label="health">健康档案</el-checkbox-button><el-checkbox-button label="upload">报告上传</el-checkbox-button><el-checkbox-button label="consent">在线签署</el-checkbox-button><el-checkbox-button label="family">家属代办</el-checkbox-button></el-checkbox-group></el-form-item>
      </el-form>
      <template #footer><el-button @click="portalDialogVisible = false">取消</el-button><el-button type="primary" @click="portalDialogVisible = false; submitAction('个人主页创建/授权已更新')">确认创建</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="患者资料追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:42" type="primary">导诊建档生成患者主档</el-timeline-item>
        <el-timeline-item timestamp="2026-05-15 09:00">患者端维护资料：{{ selected?.item }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-15 09:20" type="success">复核后回写患者主档、附件和门户账号权限</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
