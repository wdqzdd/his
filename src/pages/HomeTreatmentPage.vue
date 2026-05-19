<script setup lang="ts">
import { ref } from 'vue';
import { Bell, CircleCheck, DocumentChecked, Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type TreatmentTask = {
  id: string;
  patient: string;
  category: string;
  orderName: string;
  planTime: string;
  source: string;
  status: string;
  owner: string;
  nextAction: string;
};

const selected = ref<TreatmentTask | null>(null);
const executeDialogVisible = ref(false);
const drugDialogVisible = ref(false);
const traceDrawerVisible = ref(false);

const rows = ref<TreatmentTask[]>([
  { id: 'TRT-001', patient: '王建国', category: '待执行医嘱', orderName: '碳酸司维拉姆 0.8g tid', planTime: '2026-05-15 08:00', source: '医生站长期医嘱', status: '待确认', owner: '患者本人', nextAction: '确认服药提醒' },
  { id: 'TRT-002', patient: '李秀兰', category: '服药记录', orderName: '左卡尼汀口服液 10ml qd', planTime: '2026-05-15 09:00', source: '药房发药记录', status: '待记录', owner: '患者本人', nextAction: '登记服药' },
  { id: 'TRT-003', patient: '赵明', category: '注射记录', orderName: '促红素 4000IU 皮下注射', planTime: '2026-05-15 10:00', source: '医生站临时医嘱', status: '待执行', owner: '责任护士', nextAction: '上传注射凭证' },
  { id: 'TRT-004', patient: '陈志强', category: '领药记录', orderName: '降钾树脂 15g*7袋', planTime: '2026-05-15 11:30', source: '药房站发药', status: '待签收', owner: '家属陈丽', nextAction: '确认领药' },
  { id: 'TRT-005', patient: '周萍', category: '用药提醒', orderName: '降磷药餐中服用提醒', planTime: '2026-05-15 12:00', source: '规则配置提醒', status: '提醒中', owner: '患者本人', nextAction: '确认已读' },
  { id: 'TRT-006', patient: '郑军', category: '执行医嘱记录', orderName: '低分子肝素透后观察', planTime: '2026-05-14 18:00', source: '护士站执行记录', status: '已完成', owner: '赵护士', nextAction: '查看记录' },
  { id: 'TRT-007', patient: '韩梅', category: '待执行医嘱', orderName: '复查血钾并上传报告', planTime: '2026-05-16 08:30', source: '危急值随访', status: '待上传', owner: '患者本人', nextAction: '上传检验结果' },
  { id: 'TRT-008', patient: '林建平', category: '注射记录', orderName: '胰岛素 6U 餐前', planTime: '2026-05-15 17:30', source: '医生站用药建议', status: '异常待审核', owner: '患者本人', nextAction: '补充低血糖说明' },
  { id: 'TRT-009', patient: '孙丽', category: '服药记录', orderName: '硝苯地平控释片 30mg qd', planTime: '2026-05-15 20:00', source: '医生站长期医嘱', status: '已记录', owner: '患者本人', nextAction: '持续提醒' },
  { id: 'TRT-010', patient: '马强', category: '领药记录', orderName: '骨化三醇胶丸 0.25ug*14粒', planTime: '2026-05-15 16:00', source: '药房站', status: '已签收', owner: '家属马宁', nextAction: '费用同步' },
]);

const activeTables = ['medical_order', 'order_execution', 'home_medication_record', 'pharmacy_dispense', 'reminder_rule'];

function tagType(value: string): 'success' | 'warning' | 'danger' | 'info' {
  if (value.includes('已完成') || value.includes('已记录') || value.includes('已签收')) return 'success';
  if (value.includes('异常')) return 'danger';
  if (value.includes('待') || value.includes('提醒')) return 'warning';
  return 'info';
}

function openExecute(row: TreatmentTask): void {
  selected.value = row;
  executeDialogVisible.value = true;
}

function openDrug(row: TreatmentTask): void {
  selected.value = row;
  drugDialogVisible.value = true;
}

function openTrace(row: TreatmentTask): void {
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
            <p>患者端查看待执行医嘱、执行医嘱记录、服药、注射、领药和用药提醒，确认后回流医生站、护士站、药房站和费用闭环。</p>
          </div>
          <div class="home-actions">
            <el-button type="primary" :icon="DocumentChecked" @click="openExecute(rows[0])">记录执行</el-button>
            <el-button :icon="Bell" @click="openDrug(rows[4])">设置提醒</el-button>
            <el-button :icon="CircleCheck" @click="openDrug(rows[3])">确认领药</el-button>
          </div>
        </div>
      </template>

      <el-form class="home-filter" inline>
        <el-form-item label="关键字"><el-input placeholder="医嘱、药品、患者、来源" clearable /></el-form-item>
        <el-form-item label="治疗分类">
          <el-select placeholder="全部分类" clearable>
            <el-option label="待执行医嘱" value="待执行医嘱" />
            <el-option label="执行医嘱记录" value="执行医嘱记录" />
            <el-option label="服药记录" value="服药记录" />
            <el-option label="注射记录" value="注射记录" />
            <el-option label="领药记录" value="领药记录" />
            <el-option label="用药提醒" value="用药提醒" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态"><el-select placeholder="全部状态" clearable><el-option label="待执行" value="待执行" /><el-option label="待记录" value="待记录" /><el-option label="已完成" value="已完成" /><el-option label="异常待审核" value="异常待审核" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <el-table :data="rows" border stripe>
        <el-table-column prop="id" label="记录号" width="105" fixed="left" />
        <el-table-column prop="patient" label="患者" width="95" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="orderName" label="医嘱/药品/提醒" min-width="210" />
        <el-table-column prop="planTime" label="计划时间" width="145" />
        <el-table-column prop="source" label="来源" min-width="135" />
        <el-table-column prop="status" label="状态" width="110"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
        <el-table-column prop="owner" label="责任人" width="110" />
        <el-table-column prop="nextAction" label="下一步" min-width="130" />
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openExecute(row)">执行</el-button>
            <el-button link @click="openDrug(row)">服药/领药</el-button>
            <el-button link @click="openTrace(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="executeDialogVisible" title="记录医嘱执行" width="660px">
      <el-form label-width="110px">
        <el-form-item label="医嘱"><el-input :model-value="selected?.orderName" disabled /></el-form-item>
        <el-form-item label="执行结果"><el-radio-group model-value="done"><el-radio-button label="done">已执行</el-radio-button><el-radio-button label="miss">漏服/未执行</el-radio-button><el-radio-button label="adverse">不适反应</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="执行时间"><el-date-picker type="datetime" /></el-form-item>
        <el-form-item label="说明"><el-input type="textarea" :rows="3" placeholder="记录剂量、注射部位、漏服原因、不良反应或需医护协助的问题" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="executeDialogVisible = false">取消</el-button><el-button type="primary" @click="executeDialogVisible = false; submitAction('执行记录已提交，等待责任团队审核')">提交记录</el-button></template>
    </el-dialog>

    <el-dialog v-model="drugDialogVisible" title="服药/领药确认" width="620px">
      <el-form label-width="110px">
        <el-form-item label="项目"><el-input :model-value="selected?.orderName" disabled /></el-form-item>
        <el-form-item label="确认类型"><el-radio-group model-value="drug"><el-radio-button label="drug">服药确认</el-radio-button><el-radio-button label="injection">注射确认</el-radio-button><el-radio-button label="pickup">领药签收</el-radio-button><el-radio-button label="remind">提醒已读</el-radio-button></el-radio-group></el-form-item>
        <el-form-item label="凭证"><el-upload drag action="#"><div class="el-upload__text">上传药盒、注射或领药凭证</div></el-upload></el-form-item>
        <el-form-item label="备注"><el-input type="textarea" :rows="3" placeholder="补充用药时间、剩余药量、签收人或提醒调整要求" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="drugDialogVisible = false">取消</el-button><el-button type="primary" @click="drugDialogVisible = false; submitAction('治疗确认已回写')">提交确认</el-button></template>
    </el-dialog>

    <el-drawer v-model="traceDrawerVisible" title="居家治疗追溯" size="560px">
      <el-timeline>
        <el-timeline-item timestamp="2026-05-14 15:20" type="primary">医生开立或调整医嘱：{{ selected?.orderName }}</el-timeline-item>
        <el-timeline-item timestamp="2026-05-14 16:00">药房发药/护士宣教，生成患者端任务</el-timeline-item>
        <el-timeline-item timestamp="2026-05-15 08:00" type="success">患者确认执行，回写医嘱执行和用药依从性</el-timeline-item>
      </el-timeline>
    </el-drawer>
  </section>
</template>
