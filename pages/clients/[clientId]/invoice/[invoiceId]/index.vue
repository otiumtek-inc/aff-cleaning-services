<script setup>
import dayjs from 'dayjs-ext'
// Props, emits, context, inject

// Nuxt
definePageMeta({
  layout: "invoice",
});

// Constant

// Data and composable data
const route = useRoute();

const client = useSupabaseClient();

// Computed

// Async data call
const { data, pending, error } = await useAsyncData("client", async () =>
  client
    .from("invoice")
    .select(`*, client(*), invoice_line(*)`)
    .eq("id", route.params.invoiceId)
    .single()
);

// Computed from data call
const total = computed(
  () =>
    data.value.data?.invoice_line.reduce((acc, item) => {
      return acc + item.qty * item.price;
    }, 0) || 0
);

// Methods
const print = () => {
  window.print()
}

// Lifecycle

// Provider

// UI
</script>

<template>
  <div class="flex mb-3 gap-3 p-3 justify-center print:hidden border-b border-gray-400">
    <div @click="print" class="cursor-pointer" >Imprimir</div>
    <NuxtLink :to="`/clients/${route.params.clientId}`">Regresar</NuxtLink>
  </div>
  <div v-if="!pending">
    <div class="py-4">
      <div class="px-14 py-6">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-full align-top">
                <div>
                  <img
                    src="https://raw.githubusercontent.com/templid/email-templates/main/templid-dynamic-templates/invoice-02/brand-sample.png"
                    class="h-12"
                  />
                </div>
              </td>

              <td class="align-top">
                <div class="text-sm">
                  <table class="border-collapse border-spacing-0">
                    <tbody>
                      <tr>
                        <td class="border-r pr-4">
                          <div>
                            <p
                              class="whitespace-nowrap text-slate-400 text-right"
                            >
                              Date
                            </p>
                            <p
                              class="whitespace-nowrap font-bold text-main text-right"
                            >
                              {{ dayjs(data.data?.created_at).utc().format("MMM DD, YYYY") }}
                            </p>
                          </div>
                        </td>
                        <td class="pl-4">
                          <div>
                            <p
                              class="whitespace-nowrap text-slate-400 text-right"
                            >
                              Invoice #
                            </p>
                            <p
                              class="whitespace-nowrap font-bold text-main text-right"
                            >
                              {{data.data?.number}}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-slate-100 px-14 py-6 text-sm">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-1/2 align-top">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">AFF Cleaning Services</p>
                  <p>+1 (561) 425-3348</p>
                  <p>2033 Prairie Key Rd</p>
                  <p>Palm Springs FL 33406</p>
                  <p>United States</p>
                </div>
              </td>
              <td class="w-1/2 align-top text-right">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">{{data.data?.client.name}}</p>
                  <p>{{data.data?.client.address_street}}</p>
                  <p>{{data.data?.client.address_county}}</p>
                  <p>United States</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-14 py-10 text-sm text-neutral-700">
        <table class="w-full border-collapse border-spacing-0">
          <thead>
            <tr>
              <td class="border-b-2 border-main pb-3 pl-3 font-bold text-main">
                #
              </td>
              <td class="border-b-2 border-main pb-3 pl-2 font-bold text-main">
                Product details
              </td>
              <td
                class="border-b-2 border-main pb-3 pl-2 text-center font-bold text-main"
              >
                Qty.
              </td>
              <td
                class="border-b-2 border-main pb-3 pl-2 text-right font-bold text-main"
              >
                Price
              </td>
              <td
                class="border-b-2 border-main pb-3 pl-2 pr-3 text-right font-bold text-main"
              >
                Subtotal
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data.data?.invoice_line" :key="index">
              <td class="border-b py-3 pl-3">{{ index + 1 }}.</td>
              <td class="border-b py-3 pl-2">{{ item.detail }}</td>
              <td class="border-b py-3 pl-2 text-center">{{ item.qty }}</td>
              <td class="border-b py-3 pl-2 text-right">${{ item.price }}</td>
              <td class="border-b py-3 pl-2 pr-3 text-right">
                ${{ item.price * item.qty }}
              </td>
            </tr>
            <tr>
              <td colspan="7">
                <table class="w-full border-collapse border-spacing-0">
                  <tbody>
                    <tr>
                      <td class="w-full"></td>
                      <td>
                        <table class="w-full border-collapse border-spacing-0">
                          <tbody>
                            <!-- <tr>
                              <td class="border-b p-3">
                                <div class="whitespace-nowrap text-slate-400">
                                  Net total:
                                </div>
                              </td>
                              <td class="border-b p-3 text-right">
                                <div
                                  class="whitespace-nowrap font-bold text-main"
                                >
                                  $320.00
                                </div>
                              </td>
                            </tr> -->
                            <tr>
                              <td class="bg-main p-3">
                                <div
                                  class="whitespace-nowrap font-bold text-white"
                                >
                                  Total:
                                </div>
                              </td>
                              <td class="bg-main p-3 text-right">
                                <div
                                  class="whitespace-nowrap font-bold text-white"
                                >
                                  ${{ Math.round(total) }}
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- <div class="px-14 text-sm text-neutral-700">
        <p class="text-main font-bold">PAYMENT DETAILS</p>
        <p>Banks of Banks</p>
        <p>Bank/Sort Code: 1234567</p>
        <p>Account Number: 123456678</p>
        <p>Payment Reference: BRA-00335</p>
      </div> -->
      <div class="px-14 py-10 text-sm text-neutral-700">
        <p class="text-main font-bold">Notes</p>
        <p class="italic">
          {{ data.data?.notes }}
        </p>
      </div>
      <footer
        class="fixed bottom-0 left-0 bg-slate-100 w-full text-neutral-600 text-center text-xs py-3"
      >
        AFF Cleaning Services
        <span class="text-slate-300 px-2">|</span>
        contact@affcleaningservices.com
        <span class="text-slate-300 px-2">|</span>
        +1 (561) 425-3348
      </footer>
    </div>
  </div>
</template>

<style>
@import url("~/assets/css/styles.css");
</style>
