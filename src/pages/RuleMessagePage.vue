<script setup lang="ts">
import { ref } from 'vue';
import { Connection, DocumentAdd, Operation, Search, SwitchButton } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import type { PageContext } from '../types';

defineProps<{ context: PageContext }>();

type MessageRule = {
  id: string;
  name: string;
  scene: string;
  channel: string;
  recipient: string;
  timing: string;
  frequency: string;
  content: string;
  status: string;
  sendCount: number;
  owner: string;
  nextAction: string;
};

type LogRow = {
  time: string;
  receiver: string;
  channel: string;
  content: string;
  result: string;
  status: string;
};

const rules = ref<MessageRule[]>([
  { id: 'MSG-001', name: '长期医嘱到期提醒', scene: '医嘱有效期', channel: '站内信+短信', recipient: '主诊医生', timing: '到期前3天 07:00', frequency: '每日一次', content: '长期医嘱即将到期，请复核续用或停用', status: '启用', sendCount: 18, owner: '医生站', nextAction: '查看命中医生' },
  { id: 'MSG-002', name: '危急值确认提醒', scene: '检验危急值', channel: '站内信+电话', recipient: '主诊医生/值班医生', timing: '复核后立即', frequency: '10分钟未确认升级', content: '检验危急值待确认，请记录处置', status: '启用', sendCount: 5, owner: '检验科', nextAction: '跟进未确认' },
  { id: 'MSG-003', name: '透析签到欠费提醒', scene: '患者签到', channel: '站内信', recipient: '导诊台/费用管理员', timing: '签到时', frequency: '每次签到', content: '患者存在欠费，请沟通费用风险', status: '启用', sendCount: 11, owner: '费用管理', nextAction: '处理欠费患者' },
  { id: 'MSG-004', name: '设备水质异常提醒', scene: '水质复测', channel: '站内信+大屏', recipient: '技师组长/护士长', timing: '异常保存后立即', frequency: '未关闭每30分钟', content: '水质异常影响上机放行，请复测并关闭', status: '启用', sendCount: 3, owner: '技师站', nextAction: '复核水质' },
  { id: 'MSG-005', name: '治疗记录归档催办', scene: '治疗归档', channel: '站内信', recipient: '责任护士', timing: '班次结束前30分钟', frequency: '一次', content: '治疗记录存在缺项，请补全签名后提交', status: '启用', sendCount: 14, owner: '护士站', nextAction: '补录缺项' },
  { id: 'MSG-006', name: '通路评估预约提醒', scene: '通路到期', channel: '站内信+患者端', recipient: '责任护士/患者', timing: '到期前7天', frequency: '每3天一次', content: '通路评估即将到期，请预约评估', status: '启用', sendCount: 22, owner: '通路小组', nextAction: '预约评估' },
  { id: 'MSG-007', name: '感控整改复查提醒', scene: '整改到期', channel: '站内信', recipient: '感控护士/责任人', timing: '整改到期前1天', frequency: '每日一次', content: '感控整改即将到期，请提交复查结果', status: '待复核', sendCount: 4, owner: '感控管理', nextAction: '确认模板' },
  { id: 'MSG-008', name: '库存近效期提醒', scene: '药耗效期', channel: '站内信', recipient: '药耗管理员', timing: '效期前30天', frequency: '每日一次', content: '批号近效期，请处理调拨或停用', status: '启用', sendCount: 7, owner: '药耗管理', nextAction: '处理批号' },
  { id: 'MSG-009', name: '居家报告审核提醒', scene: '患者上传', channel: '站内信+患者端回执', recipient: '随访护士', timing: '上传后立即', frequency: '12小时未审升级', content: '患者上传报告待审核，请及时处理', status: '草稿', sendCount: 0, owner: '居家随访', nextAction: '发布测试' },
  { id: 'MSG-010', name: '培训证书到期提醒', scene: '人事证书', channel: '站内信', recipient: '员工/行政人事', timing: '到期前60天', frequency: '每周一次', content: '证书即将到期，请安排复训或续期', status: '启用', sendCount: 13, owner: '行政人事', nextAction: '查看证书' },
  { id: 'MSG-011', name: 'CRC访视窗口提醒', scene: '研究访视', channel: '站内信+短信', recipient: 'CRC/研究医生', timing: '窗口前3天', frequency: '每日一次', content: '受试者访视窗口即将开始，请预约', status: '停用', sendCount: 1, owner: 'CRC站', nextAction: '评估项目启用' },
]);

const logs = ref<LogRow[]>([
  { time: '2026-05-14 12:30', receiver: '刘护士', channel: '站内信', content: '治疗记录归档催办', result: '已读', status: '成功' },
  { time: '2026-05-14 10:20', receiver: '赵医生', channel: '站内信+电话', content: '危急值确认提醒', result: '电话升级', status: '升级' },
  { time: '2026-05-14 09:12', receiver: '周技师', channel: '站内信+大屏', content: '设备水质异常提醒', result: '已派单', status: '成功' },
  { time: '2026-05-14 08:01', receiver: '药耗管理员', channel: '站内信', content: '库存近效期提醒', result: '已读', status: '成功' },
]);

const reminderTypeRows = [
  { type: '工作任务到期提醒', target: '任务责任人', timing: '到期前 1 天/2 小时', escalation: '逾期后推送上级' },
  { type: '工作任务逾期提醒', target: '责任人、护士长、质控管理员', timing: '超过 SLA 即时', escalation: '进入看板红色待办' },
  { type: '下次随访提醒', target: '责任护士/患者端', timing: '随访前 3 天、当天', escalation: '未完成转工作任务' },
  { type: '再监测提醒', target: '医生/护士/患者端', timing: '预警处理后按复查计划', escalation: '复查超时转预警' },
  { type: '带教审核提醒', target: '带教老师', timing: '学员提交后即时', escalation: '24小时未审升级' },
  { type: '上级审核提醒', target: '上级医生/护士长', timing: '高风险记录提交后即时', escalation: '一级预警电话升级' },
];

const channelRows = [
  { channel: '短信提醒规则', scene: '危急值、签约、随访、CRC访视', receipt: '发送成功/失败回执', retry: '失败转站内信和人工处理' },
  { channel: '微信消息提醒规则', scene: '患者端任务、随访、宣教、报告审核', receipt: '患者阅读/确认回执', retry: '未读转电话随访' },
  { channel: '系统消息提醒规则', scene: '员工主页、科室看板、业务页角标', receipt: '已读、处理、关闭', retry: '逾期生成催办任务' },
];

const selectedRule = ref(rules.value[0]);
const editVisible = ref(false);
const testVisible = ref(false);
const publishVisible = ref(false);
const logVisible = ref(false);
const form = ref({ name: '', scene: '', channel: '', recipient: '', timing: '', frequency: '', content: '', escalateTo: '' });

const stats = [
  { label: '提醒规则', value: rules.value.length, tone: 'blue' },
  { label: '已启用', value: rules.value.filter((item) => item.status === '启用').length, tone: 'green' },
  { label: '今日发送', value: rules.value.reduce((sum, item) => sum + item.sendCount, 0), tone: 'orange' },
  { label: '含升级', value: rules.value.filter((item) => item.frequency.includes('升级')).length, tone: 'red' },
  { label: '待复核', value: rules.value.filter((item) => item.status !== '启用').length, tone: 'blue' },
];

function tagType(value: string) {
  if (['启用', '成功'].includes(value)) return 'success';
  if (value.includes('升级') || value.includes('电话')) return 'danger';
  if (value.includes('待') || value === '草稿') return 'warning';
  return 'info';
}

function selectRule(row: MessageRule): void {
  selectedRule.value = row;
}

function openEdit(row?: MessageRule): void {
  if (row) selectedRule.value = row;
  form.value = {
    name: selectedRule.value.name,
    scene: selectedRule.value.scene,
    channel: selectedRule.value.channel,
    recipient: selectedRule.value.recipient,
    timing: selectedRule.value.timing,
    frequency: selectedRule.value.frequency,
    content: selectedRule.value.content,
    escalateTo: '护士长/值班医生/科室看板',
  };
  editVisible.value = true;
}

function submit(message: string): void {
  ElMessage.success(message);
}
</script>

<template>
  <section class="rule-config-page">
    <el-card class="rule-work-card" shadow="never">
      <template #header>
        <div class="rule-header">
          <div>
            <h2>消息提醒规则</h2>
            <p>配置站内信、短信、电话升级和患者端回执，让关键业务提醒能按角色、时间和频次闭环。</p>
          </div>
          <div class="rule-actions">
            <el-button type="primary" :icon="DocumentAdd" @click="openEdit()">新增提醒规则</el-button>
            <el-button :icon="Operation" @click="testVisible = true">发送测试</el-button>
            <el-button :icon="SwitchButton" @click="publishVisible = true">发布启用</el-button>
            <el-button :icon="Connection" @click="logVisible = true">发送日志</el-button>
          </div>
        </div>
      </template>

      <el-form class="rule-filter" inline>
        <el-form-item label="提醒场景">
          <el-select placeholder="全部场景" clearable>
            <el-option label="医嘱/检验" value="clinical" />
            <el-option label="治疗归档" value="treatment" />
            <el-option label="设备库存" value="support" />
            <el-option label="患者端" value="patient" />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道">
          <el-select placeholder="全部渠道" clearable>
            <el-option label="站内信" value="inbox" />
            <el-option label="短信" value="sms" />
            <el-option label="电话" value="phone" />
            <el-option label="患者端" value="home" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字"><el-input placeholder="规则、接收人、提醒内容" clearable /></el-form-item>
        <el-form-item><el-button type="primary" :icon="Search">查询</el-button><el-button>重置</el-button></el-form-item>
      </el-form>

      <div class="rule-stat-grid">
        <el-card v-for="item in stats" :key="item.label" :class="['rule-stat-card', item.tone]" shadow="never"><span>{{ item.label }}</span><strong>{{ item.value }}</strong></el-card>
      </div>

      <el-row :gutter="16">
        <el-col :xs="24" :xl="16">
          <el-card class="rule-main-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>提醒规则列表</strong><el-tag effect="plain">场景 -> 接收人 -> 渠道 -> 频次 -> 回执</el-tag></div></template>
            <el-table :data="rules" border stripe highlight-current-row row-key="id" @row-click="selectRule">
              <el-table-column prop="name" label="规则名称" min-width="165" fixed="left" />
              <el-table-column prop="scene" label="提醒场景" min-width="120" />
              <el-table-column prop="channel" label="渠道" min-width="120"><template #default="{ row }"><el-tag :type="tagType(row.channel)">{{ row.channel }}</el-tag></template></el-table-column>
              <el-table-column prop="recipient" label="接收人" min-width="150" />
              <el-table-column prop="timing" label="发送时机" min-width="150" />
              <el-table-column prop="frequency" label="频次/升级" min-width="145" />
              <el-table-column prop="content" label="提醒内容" min-width="220" />
              <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
              <el-table-column prop="sendCount" label="今日发送" width="95" />
              <el-table-column prop="nextAction" label="下一步" min-width="130" />
              <el-table-column label="操作" width="210" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" @click.stop="openEdit(row)">维护</el-button>
                  <el-button link @click.stop="selectRule(row); testVisible = true">测试</el-button>
                  <el-button link @click.stop="selectRule(row); publishVisible = true">发布</el-button>
                  <el-button link @click.stop="selectRule(row); logVisible = true">日志</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :xl="8">
          <el-card class="rule-side-card" shadow="never">
            <template #header><div class="rule-card-header"><strong>当前提醒闭环</strong><el-tag :type="tagType(selectedRule.status)">{{ selectedRule.status }}</el-tag></div></template>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="场景">{{ selectedRule.scene }}</el-descriptions-item>
              <el-descriptions-item label="接收人">{{ selectedRule.recipient }}</el-descriptions-item>
              <el-descriptions-item label="时机">{{ selectedRule.timing }}</el-descriptions-item>
              <el-descriptions-item label="频次">{{ selectedRule.frequency }}</el-descriptions-item>
              <el-descriptions-item label="内容">{{ selectedRule.content }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="16" class="rule-extra-grid">
      <el-col :xs="24" :xl="14">
        <el-card class="rule-main-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>提醒类型补全</strong><el-tag effect="plain">到期 / 逾期 / 随访 / 再监测 / 审核</el-tag></div></template>
          <el-table :data="reminderTypeRows" border stripe>
            <el-table-column prop="type" label="提醒类型" min-width="160" />
            <el-table-column prop="target" label="接收对象" min-width="180" />
            <el-table-column prop="timing" label="触发时机" min-width="150" />
            <el-table-column prop="escalation" label="升级规则" min-width="180" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :xl="10">
        <el-card class="rule-side-card" shadow="never">
          <template #header><div class="rule-card-header"><strong>消息渠道规则</strong><el-tag type="success" effect="plain">短信 / 微信 / 系统消息</el-tag></div></template>
          <el-table :data="channelRows" border stripe>
            <el-table-column prop="channel" label="渠道" min-width="120" />
            <el-table-column prop="scene" label="场景" min-width="180" />
            <el-table-column prop="receipt" label="回执" min-width="130" />
            <el-table-column prop="retry" label="失败处理" min-width="170" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="editVisible" title="维护消息提醒规则" width="760px">
      <el-form :model="form" label-width="112px">
        <el-form-item label="规则名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="提醒场景"><el-input v-model="form.scene" /></el-form-item>
        <el-form-item label="发送渠道"><el-checkbox-group v-model="form.channel"><el-checkbox label="站内信" /><el-checkbox label="短信" /><el-checkbox label="电话" /><el-checkbox label="患者端" /></el-checkbox-group></el-form-item>
        <el-form-item label="接收人规则"><el-input v-model="form.recipient" /></el-form-item>
        <el-form-item label="发送时机"><el-input v-model="form.timing" /></el-form-item>
        <el-form-item label="频次规则"><el-input v-model="form.frequency" /></el-form-item>
        <el-form-item label="升级对象"><el-input v-model="form.escalateTo" /></el-form-item>
        <el-form-item label="提醒内容"><el-input v-model="form.content" type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="editVisible = false">取消</el-button><el-button type="primary" @click="editVisible = false; submit('提醒规则已保存，建议先发送测试')">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="testVisible" title="消息发送测试" width="640px">
      <el-form label-width="110px">
        <el-form-item label="测试接收人"><el-input placeholder="输入员工、角色或患者端账号" /></el-form-item>
        <el-form-item label="测试渠道"><el-checkbox-group><el-checkbox label="站内信" /><el-checkbox label="短信" /><el-checkbox label="电话" /></el-checkbox-group></el-form-item>
        <el-form-item label="测试内容"><el-input type="textarea" :rows="3" :value="selectedRule.content" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="testVisible = false">取消</el-button><el-button type="primary" @click="testVisible = false; submit('测试消息已发送，并记录回执')">发送测试</el-button></template>
    </el-dialog>

    <el-dialog v-model="publishVisible" title="发布消息提醒规则" width="540px">
      <el-alert type="warning" show-icon :closable="false" title="发布后会按配置自动发送消息，含电话升级的规则需确认值班责任人。" />
      <el-form label-width="96px" style="margin-top: 16px">
        <el-form-item label="生效时间"><el-date-picker type="datetime" placeholder="选择生效时间" /></el-form-item>
        <el-form-item label="复核意见"><el-input type="textarea" :rows="3" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="publishVisible = false">取消</el-button><el-button type="primary" @click="publishVisible = false; selectedRule.status = '启用'; submit('消息提醒规则已发布')">确认发布</el-button></template>
    </el-dialog>

    <el-drawer v-model="logVisible" title="消息发送日志" size="720px">
      <el-table :data="logs" border stripe>
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="receiver" label="接收人" width="110" />
        <el-table-column prop="channel" label="渠道" width="130" />
        <el-table-column prop="content" label="内容" min-width="170" />
        <el-table-column prop="result" label="回执" width="110" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{ row }"><el-tag :type="tagType(row.status)">{{ row.status }}</el-tag></template></el-table-column>
      </el-table>
    </el-drawer>
  </section>
</template>
