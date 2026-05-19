<script setup lang="ts">
import { ref } from 'vue';
import { CircleCheck, Finished, Operation, Search, Warning } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type ExecuteRow = {
  id: string;
  patient: string;
  orderType: string;
  item: string;
  detail: string;
  planTime: string;
  executor: string;
  doubleCheck: string;
  chargeLink: string;
  status: string;
  risk: string;
  nextAction: string;
};

const checkDialogVisible = ref(false);
const executeDialogVisible = ref(false);
const correctionDialogVisible = ref(false);
const traceDrawerVisible = ref(false);
const selected = ref<ExecuteRow | null>(null);

const rows: ExecuteRow[] = [
  { id: 'EX-001', patient: '王建国 / HD-00038', orderType: '长期医嘱', item: '透析处方核对', detail: 'HD 4h，血流260，UF 2.1L', planTime: '上机前', executor: '赵护士', doubleCheck: '需双人', chargeLink: '无费用', status: '待核对', risk: '低', nextAction: '双人核对' },
  { id: 'EX-002', patient: '王建国 / HD-00038', orderType: '注射医嘱', item: '低分子肝素钙', detail: '4100AXaIU 上机前', planTime: '上机前', executor: '赵护士', doubleCheck: '需双人', chargeLink: '药品消耗', status: '待执行', risk: '低', nextAction: '执行用药' },
  { id: 'EX-003', patient: '李秀兰 / HD-00072', orderType: '护理医嘱', item: '导管出口护理', detail: '碘伏消毒并换药', planTime: '透析前', executor: '钱护士', doubleCheck: '需双人', chargeLink: '耗材消耗', status: '待执行', risk: '中', nextAction: '执行护理' },
  { id: 'EX-004', patient: '赵明 / HD-00116', orderType: '临时医嘱', item: '高钾复查', detail: '复查血钾并通知医生', planTime: '立即', executor: '孙护士', doubleCheck: '需双人', chargeLink: '检验费用', status: '暂停', risk: '高', nextAction: '等待医嘱修正' },
  { id: 'EX-005', patient: '陈志强 / HD-00128', orderType: '嘱托医嘱', item: '通路核对', detail: '人工血管震颤检查', planTime: '穿刺前', executor: '周护士', doubleCheck: '已完成', chargeLink: '无费用', status: '已执行', risk: '中', nextAction: '写护理记录' },
  { id: 'EX-006', patient: '刘梅英 / HD-00151', orderType: '临时医嘱', item: '血液灌流', detail: 'HA130 2小时联合HD', planTime: '上机后', executor: '吴护士', doubleCheck: '需双人', chargeLink: '耗材+费用', status: '待核对', risk: '高', nextAction: '核专项同意' },
  { id: 'EX-007', patient: '孙海 / HD-00177', orderType: '注射医嘱', item: '左卡尼汀', detail: '1g 静推', planTime: '透析后', executor: '郑护士', doubleCheck: '否', chargeLink: '药品消耗', status: '待执行', risk: '低', nextAction: '执行用药' },
  { id: 'EX-008', patient: '马丽 / HD-00203', orderType: '护理医嘱', item: '隔离物品核对', detail: '专用透析器和隔离机位', planTime: '上机前', executor: '冯护士', doubleCheck: '需双人', chargeLink: '隔离耗材', status: '待核对', risk: '中', nextAction: '隔离核对' },
  { id: 'EX-009', patient: '周庆 / HD-00218', orderType: '嘱托医嘱', item: '限制超滤', detail: 'UF不超过2.0L', planTime: '治疗中', executor: '蒋护士', doubleCheck: '需双人', chargeLink: '无费用', status: '待执行', risk: '高', nextAction: '治疗记录引用' },
  { id: 'EX-010', patient: '何雪 / HD-00246', orderType: '服药医嘱', item: '碳酸司维拉姆', detail: '0.8g 口服 tid宣教', planTime: '透析后', executor: '谢护士', doubleCheck: '否', chargeLink: '药品消耗', status: '已执行', risk: '中', nextAction: '患者宣教' },
  { id: 'EX-011', patient: '潘德胜 / HD-00305', orderType: '皮试医嘱', item: '头孢皮试', detail: '皮试结果阴性后执行抗感染医嘱', planTime: '透析前', executor: '唐护士', doubleCheck: '需双人', chargeLink: '药品消耗', status: '待执行', risk: '中', nextAction: '记录皮试结果' },
  { id: 'EX-012', patient: '曹敏 / HD-00291', orderType: '输血医嘱', item: '悬浮红细胞', detail: '1U 透析中输注，交叉配血已核对', planTime: '治疗中', executor: '赵护士', doubleCheck: '需双人', chargeLink: '输血费用', status: '待核对', risk: '高', nextAction: '输血双人核对' },
  { id: 'EX-013', patient: '韩梅 / HD-00318', orderType: '出院带药', item: '降磷药带药', detail: '碳酸司维拉姆 0.8g tid 7天', planTime: '透析后', executor: '钱护士', doubleCheck: '否', chargeLink: '药品费用', status: '待执行', risk: '低', nextAction: '带药交待' },
  { id: 'EX-014', patient: '郑军 / HD-00326', orderType: '门诊处方', item: '促红素门诊处方', detail: '药房已审核，护士核对执行频次', planTime: '透析后', executor: '周护士', doubleCheck: '否', chargeLink: '药房发药', status: '已执行', risk: '低', nextAction: '回写处方执行' },
];

const activeTables = ['order_execution', 'double_check_record', 'drug_consumption', 'material_consumption', 'execution_correction'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value === '已执行' || value === '已完成' || value === '低') return 'success';
  if (value === '高' || value === '暂停') return 'danger';
  if (value.includes('待') || value === '中' || value.includes('需')) return 'warning';
  return 'info';
}

function openCheck(row?: ExecuteRow): void {
  selected.value = row ?? rows[0];
  checkDialogVisible.value = true;
}

function openExecute(row: ExecuteRow): void {
  selected.value = row;
  executeDialogVisible.value = true;
}

function openCorrection(row: ExecuteRow): void {
  selected.value = row;
  correctionDialogVisible.value = true;
}

function openTrace(row: ExecuteRow): void {
  selected.value = row;
  traceDrawerVisible.value = true;
}

function submitAction(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="nurse-execution-page">
    <el-card class="nurse-work-card" shadow="never">
      <template #header>
        <div class="nurse-header">
          <div>
            <h2>{{ context.menuTitle }}</h2>
            <p>对医生已审核医嘱和透析处方进行双人核对、执行、异常勘误，并同步药耗费用与治疗记录。</p>
          </div>
          <div class="nurse-actions">
            <el-button type="primary" :icon="Operation" @click="openCheck()">双人核对</el-button>
            <el-button :icon="Finished" @click="openExecute(rows[1])">执行医嘱</el-button>
            <el-button :icon="Warning" @click="openCorrection(rows[3])">异常勘误</el-button>
          </div>
        </div>
      </template>

      <el-form class="nurse-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="患者、医嘱、执行人、费用" clearable /></el-form-item>
        <el-form-item label="医嘱类型"><el-select placeholder="全部类型" clearable><el-option label="长期医嘱" value="长期医嘱" /><el-option label="临时医嘱" value="临时医嘱" /><el-option label="出院带药" value="出院带药" /><el-option label="皮试医嘱" value="皮试医嘱" /><el-option label="门诊处方" value="门诊处方" /><el-option label="输血医嘱" value="输血医嘱" /><el-option label="嘱托医嘱" value="嘱托医嘱" /></el-select></el-form-item>
        <el-form-item label="计划时间"><el-select placeholder="全部时间" clearable><el-option label="上机前" value="上机前" /><el-option label="治疗中" value="治疗中" /><el-option label="透析后" value="透析后" /></el-select></el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待核对" value="待核对" /><el-option label="待执行" value="待执行" /><el-option label="已执行" value="已执行" /><el-option label="暂停" value="暂停" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="执行号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" min-width="155" />
        <el-table-column prop="orderType" label="医嘱类型" width="105" />
        <el-table-column prop="item" label="项目" min-width="145" />
        <el-table-column prop="detail" label="明细" min-width="220" />
        <el-table-column prop="planTime" label="计划时间" width="105" />
        <el-table-column prop="executor" label="执行人" width="105" />
        <el-table-column prop="doubleCheck" label="双人核对" width="105"><template #default="{ row }"><el-tag :type="tagType(row.doubleCheck)" effect="plain">{{ row.doubleCheck }}</el-tag></template></el-table-column>
        <el-table-column prop="chargeLink" label="药耗费用" width="115" />
        <el-table-column prop="status" label="状态" width="100"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="risk" label="风险" width="80"><template #default="{ row }"><el-tag :type="tagType(row.risk)">{{ row.risk }}</el-tag></template></el-table-column>
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }"><el-button link type="primary" @click="openCheck(row)">核对</el-button><el-button link @click="openExecute(row)">执行</el-button><el-button link @click="openCorrection(row)">勘误</el-button><el-button link @click="openTrace(row)">追溯</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="checkDialogVisible" title="双人核对" width="640px">
      <el-form label-width="110px">
        <el-form-item label="项目"><el-input :model-value="selected ? `${selected.patient} / ${selected.item}` : ''" disabled /></el-form-item>
        <el-form-item label="核对项"><el-checkbox-group model-value="patient"><el-checkbox-button label="patient">患者身份</el-checkbox-button><el-checkbox-button label="order">医嘱</el-checkbox-button><el-checkbox-button label="rx">处方参数</el-checkbox-button><el-checkbox-button label="drug">药品耗材</el-checkbox-button><el-checkbox-button label="access">通路</el-checkbox-button></el-checkbox-group></el-form-item>
        <el-form-item label="第二核对人"><el-input placeholder="请输入第二核对护士" /></el-form-item>
        <el-form-item label="核对意见"><el-input type="textarea" :rows="3" placeholder="记录核对差异、风险提示和执行注意事项" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="checkDialogVisible = false">取消</el-button><el-button type="primary" @click="checkDialogVisible = false; submitAction('双人核对已完成')">完成核对</el-button></template>
    </el-dialog>

    <el-dialog v-model="executeDialogVisible" title="医嘱执行" width="620px">
      <el-form label-width="110px">
        <el-form-item label="执行项目"><el-input :model-value="selected?.item" disabled /></el-form-item>
        <el-form-item label="执行时间"><el-date-picker type="datetime" /></el-form-item>
        <el-form-item label="执行结果"><el-radio-group model-value="done"><el-radio-button label="done">已执行</el-radio-button><el-radio-button label="hold">暂停</el-radio-button><el-radio-button label="refuse">患者拒绝</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="批号/费用"><el-input placeholder="药品批号、耗材UDI、费用项目或无费用说明" /></el-form-item>
        <el-form-item label="执行备注"><el-input type="textarea" :rows="3" placeholder="记录剂量、途径、反应、异常和医嘱回写" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="executeDialogVisible = false">取消</el-button><el-button type="primary" @click="executeDialogVisible = false; submitAction('医嘱执行结果已写入治疗记录')">提交执行</el-button></template>
    </el-dialog>

    <el-dialog v-model="correctionDialogVisible" title="执行异常勘误" width="620px">
      <el-form label-width="110px">
        <el-form-item label="项目"><el-input :model-value="selected?.item" disabled /></el-form-item>
        <el-form-item label="异常类型"><el-select placeholder="请选择"><el-option label="执行时间错误" value="time" /><el-option label="剂量/批号错误" value="dose" /><el-option label="患者拒绝" value="refuse" /><el-option label="医生暂停" value="hold" /></el-select></el-form-item>
        <el-form-item label="勘误原因"><el-input type="textarea" :rows="3" placeholder="记录原记录、修改后内容、原因和复核人" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="correctionDialogVisible = false">取消</el-button><el-button type="danger" @click="correctionDialogVisible = false; submitAction('执行勘误已提交复核')">提交勘误</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="执行追溯" size="520px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-10 08:40" type="primary">护理审核通过，生成执行计划</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 08:50">双人核对完成</el-timeline-item>
        <el-timeline-item timestamp="2026-05-10 09:00" type="success">执行结果写入护理记录、治疗记录和药耗费用</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
