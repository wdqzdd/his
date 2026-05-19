<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  CircleCheck,
  DocumentChecked,
  FirstAidKit,
  Goods,
  Search,
  Warning,
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

const props = defineProps<{
  context: PageContext;
}>();

type PharmacyOrder = {
  id: string;
  patient: string;
  dialysisNo: string;
  diagnosis: string;
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  orderType: string;
  auditRisk: string;
  auditStatus: string;
  dispenseStatus: string;
  stockStatus: string;
  gcpFlag: string;
  pharmacist: string;
  nextAction: string;
};

type DrugInfo = {
  name: string;
  spec: string;
  stock: string;
  batch: string;
  expiry: string;
  warning: string;
};

const sectionByMenu: Record<string, string> = {
  'pharmacy-log': 'log',
  'pharmacy-audit': 'audit',
  'pharmacy-execute': 'execute',
  'pharmacy-dispense': 'dispense',
  'pharmacy-drug': 'drug',
  'pharmacy-gcp': 'gcp',
};

const activeTab = ref(sectionByMenu[props.context.menuKey] ?? 'audit');
const selectedOrderId = ref('PHA-001');
const auditDialogVisible = ref(false);
const dispenseDialogVisible = ref(false);
const returnDialogVisible = ref(false);
const gcpDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

watch(
  () => props.context.menuKey,
  (menuKey) => {
    activeTab.value = sectionByMenu[menuKey] ?? 'audit';
  },
);

const orders = ref<PharmacyOrder[]>([
  { id: 'PHA-001', patient: '赵明', dialysisNo: 'HD-00116', diagnosis: '高钾血症', drug: '聚苯乙烯磺酸钙散', dose: '5g', route: '口服', frequency: 'tid', orderType: '临时医嘱', auditRisk: '剂量适宜', auditStatus: '待审核', dispenseStatus: '未发药', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师周敏', nextAction: '药师审核' },
  { id: 'PHA-002', patient: '李秀兰', dialysisNo: 'HD-00072', diagnosis: '肾性贫血', drug: '重组人促红素注射液', dose: '4000IU', route: '皮下注射', frequency: 'biw', orderType: '长期医嘱', auditRisk: 'Hb偏低', auditStatus: '已通过', dispenseStatus: '待调配', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师周敏', nextAction: '调配核对' },
  { id: 'PHA-003', patient: '郭强', dialysisNo: 'HD-00277', diagnosis: '继发性甲旁亢', drug: '碳酸镧咀嚼片', dose: '500mg', route: '口服', frequency: 'tid', orderType: '长期医嘱', auditRisk: '与钙剂重复风险', auditStatus: '待确认', dispenseStatus: '暂停', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师陈琳', nextAction: '退回医生确认' },
  { id: 'PHA-004', patient: '何雪', dialysisNo: 'HD-00246', diagnosis: '高磷血症', drug: '司维拉姆片', dose: '800mg', route: '口服', frequency: 'tid', orderType: '长期医嘱', auditRisk: '适应症相符', auditStatus: '已通过', dispenseStatus: '已发药', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师陈琳', nextAction: '用药交待' },
  { id: 'PHA-005', patient: '陈志强', dialysisNo: 'HD-00128', diagnosis: '透中低血压', drug: '盐酸米多君片', dose: '2.5mg', route: '口服', frequency: '透前', orderType: '临时医嘱', auditRisk: '需核对血压', auditStatus: '待审核', dispenseStatus: '未发药', stockStatus: '低库存', gcpFlag: '否', pharmacist: '药师周敏', nextAction: '审核后锁库存' },
  { id: 'PHA-006', patient: '马丽', dialysisNo: 'HD-00203', diagnosis: '乙肝隔离透析', drug: '恩替卡韦片', dose: '0.5mg', route: '口服', frequency: 'qd', orderType: '长期医嘱', auditRisk: '肾功能剂量调整', auditStatus: '待确认', dispenseStatus: '暂停', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师王涛', nextAction: '与医生确认剂量' },
  { id: 'PHA-007', patient: '孙海', dialysisNo: 'HD-00177', diagnosis: '肾性贫血', drug: '蔗糖铁注射液', dose: '100mg', route: '静滴', frequency: 'qw', orderType: '长期医嘱', auditRisk: '需过敏史核对', auditStatus: '已通过', dispenseStatus: '待核对', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师王涛', nextAction: '四查十对' },
  { id: 'PHA-008', patient: '曹敏', dialysisNo: 'HD-00291', diagnosis: '骨矿物异常', drug: '骨化三醇胶丸', dose: '0.25ug', route: '口服', frequency: 'qod', orderType: '长期医嘱', auditRisk: '钙磷联动监测', auditStatus: '已通过', dispenseStatus: '已发药', stockStatus: '近效期', gcpFlag: '否', pharmacist: '药师陈琳', nextAction: '提醒复查钙磷' },
  { id: 'PHA-009', patient: '潘德胜', dialysisNo: 'HD-00305', diagnosis: 'GCP研究入组', drug: '研究药物 HD-CKD-01', dose: '方案剂量', route: '口服', frequency: '按SoA', orderType: '研究用药', auditRisk: '需受试者编号', auditStatus: '待审核', dispenseStatus: '专柜待发', stockStatus: '专柜锁定', gcpFlag: '是', pharmacist: 'GCP药师', nextAction: '核对随机号' },
  { id: 'PHA-010', patient: '周庆', dialysisNo: 'HD-00218', diagnosis: '容量负荷过高', drug: '呋塞米片', dose: '20mg', route: '口服', frequency: 'bid', orderType: '临时医嘱', auditRisk: '残肾功能核对', auditStatus: '待审核', dispenseStatus: '未发药', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师周敏', nextAction: '药师审核' },
  { id: 'PHA-011', patient: '刘梦莹', dialysisNo: 'HD-00322', diagnosis: '导管感染风险', drug: '头孢唑林钠', dose: '1g', route: '静滴', frequency: '透后', orderType: '临时医嘱', auditRisk: '过敏史缺失', auditStatus: '待确认', dispenseStatus: '暂停', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师王涛', nextAction: '退回补过敏史' },
  { id: 'PHA-012', patient: '王建国', dialysisNo: 'HD-00016', diagnosis: '抗凝治疗', drug: '低分子肝素钙', dose: '4100IU', route: '皮下注射', frequency: '透析日', orderType: '长期医嘱', auditRisk: '血小板需监测', auditStatus: '已通过', dispenseStatus: '待调配', stockStatus: '充足', gcpFlag: '否', pharmacist: '药师周敏', nextAction: '调配核对' },
]);

const drugRows = ref<DrugInfo[]>([
  { name: '重组人促红素注射液', spec: '4000IU/支', stock: '268支', batch: 'EPO260401', expiry: '2027-04', warning: '正常' },
  { name: '蔗糖铁注射液', spec: '100mg/支', stock: '86支', batch: 'IRON260211', expiry: '2026-11', warning: '正常' },
  { name: '司维拉姆片', spec: '800mg*30片', stock: '42盒', batch: 'SEV260106', expiry: '2027-01', warning: '正常' },
  { name: '骨化三醇胶丸', spec: '0.25ug*10粒', stock: '18盒', batch: 'CAL260012', expiry: '2026-07', warning: '近效期' },
  { name: '盐酸米多君片', spec: '2.5mg*20片', stock: '7盒', batch: 'MID260030', expiry: '2027-02', warning: '低库存' },
]);

const selectedOrder = computed(() => orders.value.find((item) => item.id === selectedOrderId.value) ?? orders.value[0]);

const metrics = computed(() => [
  { label: '待审核', value: orders.value.filter((item) => item.auditStatus.includes('待')).length, tone: 'orange' },
  { label: '已通过', value: orders.value.filter((item) => item.auditStatus === '已通过').length, tone: 'green' },
  { label: '需确认', value: orders.value.filter((item) => item.auditStatus === '待确认').length, tone: 'red' },
  { label: '待发药', value: orders.value.filter((item) => !['已发药', '暂停'].includes(item.dispenseStatus)).length, tone: 'blue' },
  { label: 'GCP用药', value: orders.value.filter((item) => item.gcpFlag === '是').length, tone: 'orange' },
]);

const closureChecks = computed(() => [
  { label: '诊断相符', value: selectedOrder.value.diagnosis, pass: !selectedOrder.value.auditRisk.includes('缺失') },
  { label: '剂量用法', value: `${selectedOrder.value.dose} ${selectedOrder.value.frequency}`, pass: !selectedOrder.value.auditRisk.includes('剂量调整') },
  { label: '禁忌/相互作用', value: selectedOrder.value.auditRisk, pass: !selectedOrder.value.auditRisk.includes('重复') && !selectedOrder.value.auditRisk.includes('过敏史缺失') },
  { label: '库存批号', value: selectedOrder.value.stockStatus, pass: !['低库存'].includes(selectedOrder.value.stockStatus) },
  { label: '药师审核', value: selectedOrder.value.auditStatus, pass: selectedOrder.value.auditStatus === '已通过' },
  { label: '调配发药', value: selectedOrder.value.dispenseStatus, pass: selectedOrder.value.dispenseStatus === '已发药' },
]);

const activeTables = ['pharmacy_order_audit', 'pharmacy_dispense_record', 'drug_inventory', 'drug_interaction_check', 'drug_return_record', 'gcp_drug_account'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (['已通过', '已发药', '充足', '正常', '否', '适应症相符', '剂量适宜'].includes(value)) return 'success';
  if (['待确认', '暂停', '低库存', '专柜锁定'].includes(value) || value.includes('缺失') || value.includes('重复')) return 'danger';
  if (value.includes('待') || value.includes('需') || value.includes('近效期') || value === '是' || value.includes('锁定')) return 'warning';
  return 'info';
}

function selectOrder(row: PharmacyOrder): void {
  selectedOrderId.value = row.id;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}

function passAudit(): void {
  selectedOrder.value.auditStatus = '已通过';
  selectedOrder.value.dispenseStatus = '待调配';
  auditDialogVisible.value = false;
  submitAction('药师审核已通过，进入调配核对');
}

function dispenseDrug(): void {
  selectedOrder.value.dispenseStatus = '已发药';
  dispenseDialogVisible.value = false;
  submitAction('四查十对完成，发药记录已签名');
}

function returnOrder(): void {
  selectedOrder.value.auditStatus = '待确认';
  selectedOrder.value.dispenseStatus = '暂停';
  returnDialogVisible.value = false;
  submitAction('医嘱已退回医生确认，原因写入审计日志');
}
</script>

<template>
  <section class="pharmacy-page">
    <el-card class="pharmacy-work-card" shadow="never">
      <template #header>
        <div class="pharmacy-header">
          <div>
            <h2>药房站</h2>
            <p>围绕药师审核、适宜性检查、调配核对、发药退药、禁忌提示和 GCP 药物协同形成药事闭环。</p>
          </div>
          <div class="pharmacy-actions">
            <el-button type="primary" :icon="DocumentChecked" @click="auditDialogVisible = true">药师审核</el-button>
            <el-button :icon="Goods" @click="dispenseDialogVisible = true">调配发药</el-button>
            <el-button :icon="Warning" @click="returnDialogVisible = true">退回确认</el-button>
            <el-button :icon="FirstAidKit" @click="gcpDialogVisible = true">GCP协同</el-button>
          </div>
        </div>
      </template>

      <el-form class="pharmacy-filter" inline>
        <el-form-item label="关键字">
          <el-input placeholder="患者、透析号、药品、诊断" clearable />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select placeholder="全部状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="passed" />
            <el-option label="待确认" value="confirm" />
          </el-select>
        </el-form-item>
        <el-form-item label="医嘱类型">
          <el-select placeholder="全部类型" clearable>
            <el-option label="临时医嘱" value="temp" />
            <el-option label="长期医嘱" value="long" />
            <el-option label="研究用药" value="gcp" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="pharmacy-stat-grid">
        <el-card v-for="item in metrics" :key="item.label" :class="['pharmacy-stat-card', item.tone]" shadow="never">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="pharmacy-main-card" shadow="never">
            <template #header>
              <div class="pharmacy-card-header">
                <div>
                  <strong>药师审核与发药队列</strong>
                  <p>示例数据不少于 10 条，审核覆盖诊断相符、剂量用法、重复用药、禁忌、库存批号和 GCP 用药。</p>
                </div>
                <el-tag type="primary" effect="plain">医嘱 -> 审核 -> 调配核对 -> 发药/退回 -> 签名追溯</el-tag>
              </div>
            </template>
            <el-table :data="orders" border stripe highlight-current-row row-key="id" @row-click="selectOrder">
              <el-table-column prop="patient" label="患者" width="90" fixed="left" />
              <el-table-column prop="dialysisNo" label="透析号" width="112" />
              <el-table-column prop="diagnosis" label="诊断" min-width="130" />
              <el-table-column prop="drug" label="药品" min-width="160" />
              <el-table-column prop="dose" label="剂量" width="90" />
              <el-table-column prop="route" label="途径" width="90" />
              <el-table-column prop="frequency" label="频次" width="90" />
              <el-table-column prop="auditRisk" label="审核提示" min-width="150" />
              <el-table-column prop="auditStatus" label="审核" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.auditStatus)">{{ row.auditStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="dispenseStatus" label="发药" width="95">
                <template #default="{ row }">
                  <el-tag :type="tagType(row.dispenseStatus)" effect="plain">{{ row.dispenseStatus }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="stockStatus" label="库存" width="90" />
              <el-table-column prop="gcpFlag" label="GCP" width="75" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="220" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="selectOrder(row); auditDialogVisible = true">审核</el-button>
                  <el-button link @click.stop="selectOrder(row); dispenseDialogVisible = true">发药</el-button>
                  <el-button link @click.stop="selectOrder(row); returnDialogVisible = true">退回</el-button>
                  <el-button link @click.stop="selectOrder(row); traceDrawerVisible = true">追溯</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :xl="8">
          <el-card class="pharmacy-side-card" shadow="never">
            <template #header>
              <div class="pharmacy-card-header">
                <strong>当前医嘱闭环</strong>
                <el-tag :type="tagType(selectedOrder.auditStatus)">{{ selectedOrder.auditStatus }}</el-tag>
              </div>
            </template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="患者">{{ selectedOrder.patient }} / {{ selectedOrder.dialysisNo }}</el-descriptions-item>
              <el-descriptions-item label="药品">{{ selectedOrder.drug }}</el-descriptions-item>
              <el-descriptions-item label="用法">{{ selectedOrder.dose }} {{ selectedOrder.route }} {{ selectedOrder.frequency }}</el-descriptions-item>
              <el-descriptions-item label="药师">{{ selectedOrder.pharmacist }}</el-descriptions-item>
            </el-descriptions>
            <div class="pharmacy-check-list">
              <div v-for="item in closureChecks" :key="item.label" class="pharmacy-check-row">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <el-icon :class="{ pass: item.pass, block: !item.pass }">
                  <CircleCheck v-if="item.pass" />
                  <Warning v-else />
                </el-icon>
              </div>
            </div>
            <div class="pharmacy-quick-actions">
              <el-button type="primary" @click="auditDialogVisible = true">审核通过</el-button>
              <el-button @click="returnDialogVisible = true">退回医生</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="pharmacy-workspace-card" shadow="never">
      <template #header>
        <div class="pharmacy-card-header">
          <div>
            <strong>药品信息与 GCP 协同</strong>
            <p>药品库存、批号效期、禁忌提示和研究药物专柜管理要与审核、发药、退药记录关联。</p>
          </div>
          <el-button type="primary" :icon="FirstAidKit" @click="gcpDialogVisible = true">研究药物协同</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="药品信息" name="drug">
          <el-table :data="drugRows" border stripe>
            <el-table-column prop="name" label="药品" min-width="170" />
            <el-table-column prop="spec" label="规格" min-width="130" />
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column prop="batch" label="批号" min-width="130" />
            <el-table-column prop="expiry" label="效期" width="100" />
            <el-table-column prop="warning" label="预警" width="100">
              <template #default="{ row }">
                <el-tag :type="tagType(row.warning)">{{ row.warning }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="GCP药物" name="gcp">
          <el-alert type="warning" show-icon :closable="false" title="研究药物需核对项目、受试者编号、随机号、SoA访视、药物批号和回收记录。" />
          <el-descriptions class="dialog-form" :column="3" border>
            <el-descriptions-item label="专柜库存">HD-CKD-01 36盒</el-descriptions-item>
            <el-descriptions-item label="待发药">1 人</el-descriptions-item>
            <el-descriptions-item label="待回收">2 盒</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="auditDialogVisible" title="药师审核" width="680px">
      <el-alert type="warning" show-icon :closable="false" title="审核应核对诊断相符、剂量用法、给药途径、重复用药、相互作用和禁忌。" />
      <el-form class="dialog-form" label-width="110px">
        <el-form-item label="医嘱">
          <el-input :model-value="`${selectedOrder.drug} ${selectedOrder.dose} ${selectedOrder.frequency}`" />
        </el-form-item>
        <el-form-item label="审核意见">
          <el-input type="textarea" :rows="3" placeholder="记录审核依据、风险提示、是否需医生确认" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button @click="returnOrder">退回确认</el-button>
        <el-button type="primary" @click="passAudit">审核通过</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dispenseDialogVisible" title="调配发药" width="680px">
      <el-form label-width="110px">
        <el-form-item label="四查十对">
          <el-checkbox-group model-value="prescription">
            <el-checkbox-button label="prescription">处方</el-checkbox-button>
            <el-checkbox-button label="drug">药品</el-checkbox-button>
            <el-checkbox-button label="compatibility">配伍禁忌</el-checkbox-button>
            <el-checkbox-button label="rational">用药合理性</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="批号">
          <el-input placeholder="扫描或录入批号" />
        </el-form-item>
        <el-form-item label="用药交待">
          <el-input type="textarea" :rows="3" placeholder="记录用法用量、注意事项、复查要求" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dispenseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dispenseDrug">确认发药</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="returnDialogVisible" title="退回医生确认" width="620px">
      <el-form label-width="110px">
        <el-form-item label="退回原因">
          <el-select model-value="risk">
            <el-option label="剂量/用法需确认" value="dose" />
            <el-option label="重复用药或禁忌" value="risk" />
            <el-option label="过敏史缺失" value="allergy" />
            <el-option label="库存不可用" value="stock" />
          </el-select>
        </el-form-item>
        <el-form-item label="说明">
          <el-input type="textarea" :rows="3" placeholder="说明退回依据和建议替代方案" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="returnDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="returnOrder">确认退回</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="gcpDialogVisible" title="GCP药物协同" width="640px">
      <el-form label-width="110px">
        <el-form-item label="受试者">
          <el-input :model-value="selectedOrder.gcpFlag === '是' ? selectedOrder.patient : ''" placeholder="选择受试者" />
        </el-form-item>
        <el-form-item label="随机号">
          <el-input placeholder="核对随机号和访视窗" />
        </el-form-item>
        <el-form-item label="发放/回收">
          <el-radio-group model-value="dispense">
            <el-radio-button label="dispense">发放</el-radio-button>
            <el-radio-button label="return">回收</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="gcpDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="gcpDialogVisible = false; submitAction('GCP药物台账已更新')">保存台账</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="药事追溯" size="580px">
      <el-timeline>
        <el-timeline-item timestamp="医生开立" type="primary">{{ selectedOrder.drug }}，{{ selectedOrder.dose }} {{ selectedOrder.frequency }}</el-timeline-item>
        <el-timeline-item timestamp="药师审核" type="warning">审核提示：{{ selectedOrder.auditRisk }}；状态：{{ selectedOrder.auditStatus }}</el-timeline-item>
        <el-timeline-item timestamp="调配核对" type="success">库存：{{ selectedOrder.stockStatus }}；发药：{{ selectedOrder.dispenseStatus }}</el-timeline-item>
        <el-timeline-item timestamp="输出">发药记录、库存扣减、费用、用药交待和审计签名。</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
