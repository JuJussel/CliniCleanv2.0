<template>
    <div>
        <div v-if="!readyForBill" class="check">
            <span>
                <div>オルカの行為登録未済</div>
                <div><b>オルカID: {{ item.patient }}</b></div>
            </span>
            <span>
                <el-button :loading="refreshingBill" size="small" icon="el-icon-refresh" @click="refreshBill">再チェック</el-button>
            </span>
        </div>
        <div v-else>
            <el-form size="small" ref="form" :model="form" label-width="130px">
                <el-form-item label="今回の患者負担額" style="color: #303133!important">
                    <el-input readonly v-model="form.amount"><i slot="suffix" class="fas fa-yen-sign"></i></el-input>
                </el-form-item>
                <el-form-item label="入金額">
                    <el-input-number v-model="form.received"><i slot="suffix" class="fas fa-yen-sign"></i></el-input-number>
                                    <div>
                    <el-button style="width: 40px; padding: 7px" @click="form.received=1000" size="mini">１千</el-button>
                    <el-button style="width: 40px; padding: 7px" @click="form.received=5000" size="mini">５千</el-button>
                    <el-button style="width: 40px; padding: 7px" @click="form.received=10000" size="mini">１万</el-button>
                </div>

                </el-form-item>
                <el-form-item label="おつり">
                    <el-input readonly v-model="paymentChange"><i slot="suffix" class="fas fa-yen-sign"></i></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div style="float: right">
            <el-button type="text" @click="cancel">キャンセル</el-button>
            <el-button type="primary" :loading="insertingPayment" :disabled="paymentChange < 0 || paymentChange === ''" @click="confirmPayment">保存</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'item'
    ],
    data() {
        return {
            readyForBill: false,
            form: {
                amount: 1000,
                received: ''
            },
            refreshingBill: false,
            insertingPayment: false,
            invoiceNumber: ""
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel')
        },
        confirmPayment() {
            this.insertingPayment = true
            this.doRequest('insertPayment', {patient: this.item.patient, shinsatsuID: this.item.shinsatsuID}).then(result => {
                this.insertingPayment = false
                this.$emit('submitted')
            })
        },
        refreshBill() {
            this.readyForBill = false;
            this.refreshingBill = true;
            this.doRequest('getOrcaKouiStatus', {patient: this.item.patient}).then(result => {
                console.log(result);
                
                if (result.data.done) {
                    this.readyForBill = true;
                    this.form.amount = result.data.price;
                    this.invoiceNumber = result.data.invoiceNumber;
                }
                this.refreshingBill = false
            })
        }
    },
    created() {
        this.refreshBill()
    },
    computed: {
        paymentChange () {
            let change = this.form.received - this.form.amount
            if (change < 0) {
                change = ''
            }
            return change
        }
    }
}
</script>

<style>
    .check {
        display: flex;
        margin-bottom: 10px;
        justify-content: space-between;
        align-items: center;
    }
</style>
