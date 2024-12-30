<script setup lang="ts">

import {usePromisifiedModal} from "@/composables/promisifiedModal";
import {reactive, ref} from "vue";
import {VaStepper} from "vuestic-ui";

const {isOpened, run, close, ok} = usePromisifiedModal(null);
defineExpose({
    isOpened,
    run,
    close
})

const step = ref(0)

const steps = [
    {label: 'Info', icon: 'info'},
    {label: 'Search', icon: 'search'},
    {label: 'Endpoints', icon: 'travel_explore'},
    {label: 'Stores', icon: 'store'},
]

const form = reactive({
    searchString: '',
    lastName: '',
    country: '',
    birthDate: null as Date | null,
    time: null as Date | null,
    acknowledgement: false,
    notifications: true,
    paymentMethod: '',
    amount: 1,
    count: 1,
})
</script>


<template>

    <va-modal :modelValue="isOpened" no-padding class="infobox" @ok="ok" hide-default-actions>
        <template #footer class="footer">
            <VaButton> Custom action</VaButton>
        </template>
        <template #default="{ ok }">
            <va-button
                preset="secondary"
                class="mr-1 mb-1 close"
                @click="close"
            >
                x
            </va-button>
            <va-card-content>

                <VaStepper
                    v-model="step"
                    :steps="steps"
                    controlsHidden
                >
                    <template #step-content-0>
                        <ul>
                            <li>Select a category</li>
                            <li>Browse products</li>
                            <li>Add to cart</li>
                        </ul>
                    </template>
                    <template #step-content-1>
                        <VaForm ref="formRef" class="flex flex-col items-baseline gap-6">
                           <VaInput class="flex"
                               v-model="form.searchString"
                               :rules="[(value) => (value && value.length > 0) || 'First name is required']"
                               label="Search Item"
                           />

                           <VaInput  class="flex"
                               v-model="form.lastName"
                               :rules="[(value) => (value && value.length > 0) || 'Last name is required']"
                               label="Last Name"
                           />


                       </VaForm>
                    </template>
                    <template #step-content-2>
                        <ul>
                            <li>View order summary</li>
                            <li>Edit shipping information</li>
                        </ul>
                    </template>
                    <template #step-content-3>
                        <ul>
                            <li>Review order details</li>
                            <li>Complete payment</li>
                        </ul>
                    </template>
                </VaStepper>
            </va-card-content>


        </template>

    </va-modal>

</template>

<style  lang="scss">
.footer, .va-modal__footer, #loadSaveModalFooter {

    background: #f7f7f7;
    padding: 10px 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-end;
}
.flex{
    width:100%;
}
</style>
