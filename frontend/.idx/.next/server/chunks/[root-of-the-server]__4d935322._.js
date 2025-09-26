module.exports = {

"[project]/.next-internal/server/app/api/expenses/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/data.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "expenses": (()=>expenses)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/subDays.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addDays.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/formatISO.mjs [app-route] (ecmascript)");
;
const today = new Date();
const expenses = [
    {
        id: '1',
        name: 'Conta de Luz',
        amount: 175.50,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subDays"])(today, 5)),
        status: 'overdue',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '2',
        name: 'Assinatura de Internet',
        amount: 99.99,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subDays"])(today, 2)),
        status: 'overdue',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '9',
        name: 'Fatura do Cartão',
        amount: 1250.00,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subDays"])(today, 1)),
        status: 'overdue',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '3',
        name: 'Academia',
        amount: 80.00,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 2)),
        status: 'due-soon',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '4',
        name: 'Conta de Água',
        amount: 65.20,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 6)),
        status: 'due-soon',
        type: 'Nota',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '5',
        name: 'Aluguel',
        amount: 2200.00,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 15)),
        status: 'due',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '6',
        name: 'Seguro do Carro',
        amount: 350.00,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 25)),
        status: 'due',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '10',
        name: 'Plano de Celular',
        amount: 55.00,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 20)),
        status: 'due',
        type: 'Nota',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '7',
        name: 'Parcela do Sofá',
        amount: 250.75,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subDays"])(today, 10)),
        status: 'paid',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '8',
        name: 'Supermercado',
        amount: 610.30,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$subDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["subDays"])(today, 12)),
        status: 'paid',
        type: 'Nota',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '11',
        name: 'Manutenção do Carro',
        amount: 450.00,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 8)),
        status: 'due',
        type: 'Nota',
        createdBy: 'Usuário Exemplo'
    },
    {
        id: '12',
        name: 'Netflix',
        amount: 39.90,
        dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$formatISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatISO"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addDays"])(today, 4)),
        status: 'due-soon',
        type: 'Boleto',
        createdBy: 'Usuário Exemplo'
    }
];
}}),
"[project]/src/app/api/expenses/[id]/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DELETE": (()=>DELETE),
    "GET": (()=>GET),
    "PUT": (()=>PUT)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isBefore.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfDay.mjs [app-route] (ecmascript)");
;
;
;
async function GET(request, { params }) {
    const id = params.id;
    const expense = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"].find((e)=>e.id === id);
    if (!expense) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Despesa não encontrada'
        }, {
            status: 404
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(expense);
}
async function PUT(request, { params }) {
    try {
        const id = params.id;
        const updatedExpenseData = await request.json();
        const expenseIndex = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"].findIndex((e)=>e.id === id);
        if (expenseIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Despesa não encontrada'
            }, {
                status: 404
            });
        }
        // Handle simple status update
        if (updatedExpenseData.status && Object.keys(updatedExpenseData).length === 1) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex].status = updatedExpenseData.status;
            // If an expense is marked as unpaid, we may need to recalculate its status
            // based on the due date.
            if (updatedExpenseData.status !== 'paid') {
                const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])(new Date());
                const dueDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfDay$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startOfDay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseISO"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex].dueDate));
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBefore"])(dueDate, today)) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex].status = 'overdue';
                } else {
                    // We don't have the `dueSoonDays` config here, so we just reset to 'due'.
                    // The client will calculate the correct status on the next fetch.
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex].status = 'due';
                }
            }
        } else {
            // Handle full expense update
            const updatedExpense = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex],
                ...updatedExpenseData,
                amount: parseFloat(updatedExpenseData.amount)
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex] = updatedExpense;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"][expenseIndex], {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Erro ao atualizar despesa',
            error
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const id = params.id;
        const expenseIndex = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"].findIndex((e)=>e.id === id);
        if (expenseIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: 'Despesa não encontrada'
            }, {
                status: 404
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["expenses"].splice(expenseIndex, 1);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Despesa excluída com sucesso'
        }, {
            status: 200
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: 'Erro ao excluir despesa',
            error
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__4d935322._.js.map