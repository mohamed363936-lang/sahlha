(() => {
  "use strict";
  const STORE_KEY = "sahlha-v1-data";
  const todayISO = () => new Date().toLocaleDateString("en-CA");
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const defaultData = () => ({tasks:[],notes:[],expenses:[],shopping:[],budgetLimit:0,currency:"MAD",language:"ar"});
  let data = loadData();
  let taskFilter = "all";
  let installPrompt = null;
  let toastTimer;

  const translations = {
    ar: {
      appName:"سهّلها",tagline:"مساحة يومك المنظّمة",navHome:"الرئيسية",navTasks:"المهام",navNotes:"الملاحظات",navBudget:"الميزانية",navShopping:"المشتريات",navCalculator:"الحاسبة",privateTitle:"بياناتك محلية",privateText:"تُحفظ على هذا الجهاز فقط.",exportData:"تصدير بياناتي",importData:"استيراد نسخة",dailySpace:"مساحتك اليومية",installApp:"تثبيت التطبيق",welcomePill:"خطوة صغيرة، يوم أفضل",welcomeTitle:"خلّ يومك أسهل.",welcomeText:"رتّب مهامك، دوّن أفكارك، وتابع مصاريفك من مكان واحد.",startOrganizing:"ابدأ التنظيم ←",overview:"نظرة عامة",overviewSub:"ملخص سريع ليومك",openTasks:"مهام غير مكتملة",savedNotes:"ملاحظات محفوظة",thisMonthSpend:"مصروفات الشهر",shoppingLeft:"أشياء في قائمة المشتريات",nextTasks:"المهام القادمة",smallSteps:"إنجازات صغيرة تصنع فرقًا",viewAll:"عرض الكل",quickActions:"إجراءات سريعة",saveTime:"وفّر وقتك بخطوة واحدة",addTask:"إضافة مهمة",addTaskHint:"لا تنسَ ما يهمك",addNote:"كتابة ملاحظة",addNoteHint:"احفظ فكرتك بسرعة",addExpense:"تسجيل مصروف",addExpenseHint:"تابع أين تذهب أموالك",shoppingList:"قائمة المشتريات",shoppingHint:"تذكّر ما تحتاجه",tasksTitle:"المهام",tasksSub:"خطّط لخطوتك التالية",taskName:"اسم المهمة",dueDate:"تاريخ الاستحقاق (اختياري)",filterAll:"الكل",filterOpen:"غير مكتملة",filterDone:"مكتملة",notesTitle:"الملاحظات",notesSub:"أفكارك تستحق مكانًا آمنًا",noteTitle:"عنوان الملاحظة",noteBody:"المحتوى",saveNote:"حفظ الملاحظة",budgetTitle:"الميزانية والمصاريف",budgetSub:"صورة أوضح لأموالك",monthlyBudget:"الميزانية الشهرية",setYourLimit:"حدد حدّك الشهري",spentSoFar:"المصروف حتى الآن",thisMonth:"هذا الشهر",remaining:"المتبقي",afterExpenses:"بعد خصم المصروفات",monthlyBudgetAmount:"قيمة الميزانية الشهرية",currency:"العملة",saveBudget:"حفظ الميزانية",newExpense:"مصروف جديد",expenseName:"اسم المصروف",amount:"المبلغ",expenseDate:"التاريخ",expenseHistory:"سجل المصروفات",clearHistory:"مسح السجل",shoppingTitle:"قائمة المشتريات",shoppingSub:"كل ما تحتاجه في مكان واحد",itemName:"اسم الغرض",quantity:"الكمية (اختياري)",addItem:"إضافة غرض",removeChecked:"حذف العناصر المحددة",calculatorTitle:"الحاسبة",calculatorSub:"حساب سريع وبسيط",calculation:"عملية حسابية",calcHint:"تُقبل العمليات الحسابية الأساسية فقط.",footerText:"سهّلها — أدواتك اليومية، ببساطة.",localOnly:"نسختك الأولية • البيانات محفوظة على جهازك",noTasks:"لا توجد مهام هنا بعد. أضف أول مهمة!",noNotes:"لا توجد ملاحظات بعد. دوّن فكرتك الأولى!",noExpenses:"لم تسجّل مصروفات بعد.",noShopping:"قائمة المشتريات فارغة. أضف ما تحتاجه!",taskDone:"تم تحديث المهمة.",taskAdded:"تمت إضافة المهمة.",noteSaved:"تم حفظ الملاحظة.",expenseAdded:"تم تسجيل المصروف.",budgetSaved:"تم حفظ الميزانية.",itemAdded:"تمت إضافة الغرض.",deleted:"تم الحذف.",confirmDelete:"هل تريد حذف هذا العنصر؟",confirmClearExpenses:"هل تريد حذف سجل المصروفات بالكامل؟",importSuccess:"تم استيراد البيانات بنجاح.",importError:"تعذر استيراد الملف. تأكد أنه نسخة سهّلها.",exportSuccess:"تم تنزيل نسخة من بياناتك.",emptyTitle:"بدون عنوان",noDueDate:"بلا موعد",due:"موعد",done:"مكتملة",pending:"قيد الإنجاز",delete:"حذف",edit:"تعديل",cancel:"إلغاء",save:"حفظ",today:"اليوم",itemsProgress:"تم إنجاز {done} من {total}",limitExceeded:"تنبيه: تجاوزت الميزانية الشهرية.",badCalculation:"عملية غير صالحة",notificationUnsupported:"التذكيرات تحتاج إلى متصفح يدعم الإشعارات ونسخة آمنة (HTTPS أو localhost).",notificationGranted:"تم تفعيل الإشعارات لهذا المتصفح.",remindMe:"تفعيل إشعارات المهام",reminderHelp:"الإشعار لا يعمل في كل الأجهزة عند إغلاق التطبيق.",languageChanged:"تم تغيير اللغة."
    },
    en: {
      appName:"Sahlha",tagline:"Your organized day",navHome:"Home",navTasks:"Tasks",navNotes:"Notes",navBudget:"Budget",navShopping:"Shopping",navCalculator:"Calculator",privateTitle:"Your data stays local",privateText:"Saved on this device only.",exportData:"Export my data",importData:"Import backup",dailySpace:"YOUR DAILY SPACE",installApp:"Install app",welcomePill:"Small step, better day",welcomeTitle:"Make your day easier.",welcomeText:"Organize tasks, capture ideas, and track spending in one place.",startOrganizing:"Get organized →",overview:"Overview",overviewSub:"A quick snapshot of your day",openTasks:"Open tasks",savedNotes:"Saved notes",thisMonthSpend:"This month's spending",shoppingLeft:"Items on shopping list",nextTasks:"Upcoming tasks",smallSteps:"Small wins make a difference",viewAll:"View all",quickActions:"Quick actions",saveTime:"Save time in one step",addTask:"Add a task",addTaskHint:"Remember what matters",addNote:"Write a note",addNoteHint:"Capture an idea quickly",addExpense:"Add expense",addExpenseHint:"See where money goes",shoppingList:"Shopping list",shoppingHint:"Remember what you need",tasksTitle:"Tasks",tasksSub:"Plan your next step",taskName:"Task name",dueDate:"Due date (optional)",filterAll:"All",filterOpen:"Open",filterDone:"Completed",notesTitle:"Notes",notesSub:"Give your ideas a safe place",noteTitle:"Note title",noteBody:"Content",saveNote:"Save note",budgetTitle:"Budget & expenses",budgetSub:"Get a clearer view of your money",monthlyBudget:"Monthly budget",setYourLimit:"Set your monthly limit",spentSoFar:"Spent so far",thisMonth:"This month",remaining:"Remaining",afterExpenses:"After expenses",monthlyBudgetAmount:"Monthly budget amount",currency:"Currency",saveBudget:"Save budget",newExpense:"New expense",expenseName:"Expense name",amount:"Amount",expenseDate:"Date",expenseHistory:"Expense history",clearHistory:"Clear history",shoppingTitle:"Shopping list",shoppingSub:"Everything you need in one place",itemName:"Item name",quantity:"Quantity (optional)",addItem:"Add item",removeChecked:"Remove checked items",calculatorTitle:"Calculator",calculatorSub:"Quick, simple calculations",calculation:"Calculation",calcHint:"Basic arithmetic only.",footerText:"Sahlha — everyday tools, made simple.",localOnly:"Prototype • data is stored on your device",noTasks:"No tasks here yet. Add your first task!",noNotes:"No notes yet. Capture your first idea!",noExpenses:"No expenses recorded yet.",noShopping:"Your shopping list is empty. Add what you need!",taskDone:"Task updated.",taskAdded:"Task added.",noteSaved:"Note saved.",expenseAdded:"Expense recorded.",budgetSaved:"Budget saved.",itemAdded:"Item added.",deleted:"Deleted.",confirmDelete:"Delete this item?",confirmClearExpenses:"Delete the entire expense history?",importSuccess:"Data imported successfully.",importError:"Could not import file. Make sure it is a Sahlha backup.",exportSuccess:"A backup of your data was downloaded.",emptyTitle:"Untitled",noDueDate:"No due date",due:"Due",done:"Completed",pending:"In progress",delete:"Delete",edit:"Edit",cancel:"Cancel",save:"Save",today:"Today",itemsProgress:"{done} of {total} completed",limitExceeded:"Notice: monthly budget exceeded.",badCalculation:"Invalid expression",notificationUnsupported:"Reminders need a browser that supports notifications and a secure context (HTTPS or localhost).",notificationGranted:"Notifications enabled for this browser.",remindMe:"Enable task notifications",reminderHelp:"Notifications may not work on every device when the app is closed.",languageChanged:"Language changed."
    },
    fr: {
      appName:"Sahlha",tagline:"Votre journée organisée",navHome:"Accueil",navTasks:"Tâches",navNotes:"Notes",navBudget:"Budget",navShopping:"Achats",navCalculator:"Calculatrice",privateTitle:"Vos données restent locales",privateText:"Enregistrées sur cet appareil uniquement.",exportData:"Exporter mes données",importData:"Importer une sauvegarde",dailySpace:"VOTRE ESPACE QUOTIDIEN",installApp:"Installer l’application",welcomePill:"Un petit pas, une meilleure journée",welcomeTitle:"Simplifiez votre journée.",welcomeText:"Organisez vos tâches, notez vos idées et suivez vos dépenses au même endroit.",startOrganizing:"M’organiser →",overview:"Vue d’ensemble",overviewSub:"Un aperçu rapide de votre journée",openTasks:"Tâches en cours",savedNotes:"Notes enregistrées",thisMonthSpend:"Dépenses du mois",shoppingLeft:"Articles dans la liste",nextTasks:"Tâches à venir",smallSteps:"Les petits progrès comptent",viewAll:"Tout voir",quickActions:"Actions rapides",saveTime:"Gagnez du temps en un geste",addTask:"Ajouter une tâche",addTaskHint:"N’oubliez pas l’essentiel",addNote:"Écrire une note",addNoteHint:"Capturez une idée rapidement",addExpense:"Ajouter une dépense",addExpenseHint:"Suivez vos dépenses",shoppingList:"Liste de courses",shoppingHint:"N’oubliez rien",tasksTitle:"Tâches",tasksSub:"Planifiez la prochaine étape",taskName:"Nom de la tâche",dueDate:"Échéance (facultatif)",filterAll:"Tout",filterOpen:"En cours",filterDone:"Terminées",notesTitle:"Notes",notesSub:"Offrez un espace à vos idées",noteTitle:"Titre de la note",noteBody:"Contenu",saveNote:"Enregistrer la note",budgetTitle:"Budget et dépenses",budgetSub:"Une vision plus claire de votre argent",monthlyBudget:"Budget mensuel",setYourLimit:"Définissez votre limite mensuelle",spentSoFar:"Dépensé jusqu’ici",thisMonth:"Ce mois-ci",remaining:"Restant",afterExpenses:"Après les dépenses",monthlyBudgetAmount:"Montant du budget mensuel",currency:"Devise",saveBudget:"Enregistrer le budget",newExpense:"Nouvelle dépense",expenseName:"Nom de la dépense",amount:"Montant",expenseDate:"Date",expenseHistory:"Historique des dépenses",clearHistory:"Effacer l’historique",shoppingTitle:"Liste de courses",shoppingSub:"Tout ce dont vous avez besoin au même endroit",itemName:"Nom de l’article",quantity:"Quantité (facultatif)",addItem:"Ajouter un article",removeChecked:"Supprimer les articles cochés",calculatorTitle:"Calculatrice",calculatorSub:"Calculs rapides et simples",calculation:"Calcul",calcHint:"Opérations arithmétiques de base uniquement.",footerText:"Sahlha — vos outils quotidiens, simplement.",localOnly:"Prototype • données enregistrées sur votre appareil",noTasks:"Aucune tâche. Ajoutez votre première tâche !",noNotes:"Aucune note. Notez votre première idée !",noExpenses:"Aucune dépense enregistrée.",noShopping:"Votre liste est vide. Ajoutez ce dont vous avez besoin !",taskDone:"Tâche mise à jour.",taskAdded:"Tâche ajoutée.",noteSaved:"Note enregistrée.",expenseAdded:"Dépense enregistrée.",budgetSaved:"Budget enregistré.",itemAdded:"Article ajouté.",deleted:"Supprimé.",confirmDelete:"Supprimer cet élément ?",confirmClearExpenses:"Supprimer tout l’historique des dépenses ?",importSuccess:"Données importées avec succès.",importError:"Impossible d’importer le fichier. Vérifiez la sauvegarde Sahlha.",exportSuccess:"Une sauvegarde de vos données a été téléchargée.",emptyTitle:"Sans titre",noDueDate:"Sans échéance",due:"Échéance",done:"Terminée",pending:"En cours",delete:"Supprimer",edit:"Modifier",cancel:"Annuler",save:"Enregistrer",today:"Aujourd’hui",itemsProgress:"{done} sur {total} terminés",limitExceeded:"Attention : budget mensuel dépassé.",badCalculation:"Expression invalide",notificationUnsupported:"Les rappels nécessitent un navigateur compatible et un contexte sécurisé (HTTPS ou localhost).",notificationGranted:"Notifications activées pour ce navigateur.",remindMe:"Activer les notifications de tâches",reminderHelp:"Les notifications peuvent ne pas fonctionner lorsque l’application est fermée.",languageChanged:"Langue modifiée."
    }
  };

  function loadData() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY));
      return parsed && typeof parsed === "object" ? {...defaultData(), ...parsed} : defaultData();
    } catch { return defaultData(); }
  }
  function saveData() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
    catch { showToast("Storage is full. Export your data and remove some items."); }
  }
  const t = key => (translations[data.language] || translations.ar)[key] || translations.ar[key] || key;
  const el = id => document.getElementById(id);
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function showToast(message) {
    const toast = el("toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function formatMoney(amount) {
    try { return new Intl.NumberFormat(data.language === "ar" ? "ar-MA" : data.language === "fr" ? "fr-FR" : "en-US", {style:"currency",currency:data.currency || "MAD",maximumFractionDigits:2}).format(Number(amount)||0); }
    catch { return `${(Number(amount)||0).toFixed(2)} ${data.currency || "MAD"}`; }
  }
  function formatDate(date) {
    if (!date) return t("noDueDate");
    try { return new Intl.DateTimeFormat(data.language === "ar" ? "ar" : data.language === "fr" ? "fr-FR" : "en-US", {dateStyle:"medium"}).format(new Date(`${date}T12:00:00`)); }
    catch { return date; }
  }
  function applyLanguage() {
    document.documentElement.lang = data.language;
    document.documentElement.dir = data.language === "ar" ? "rtl" : "ltr";
    el("languageSelect").value = data.language;
    document.querySelectorAll("[data-i18n]").forEach(node => {
      const key = node.dataset.i18n; if (t(key)) node.textContent = t(key);
    });
    el("todayLabel").textContent = new Intl.DateTimeFormat(data.language === "ar" ? "ar" : data.language === "fr" ? "fr-FR" : "en-US", {dateStyle:"full"}).format(new Date());
    renderAll();
  }
  function setPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === `page-${page}`));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));
    const active = document.querySelector(`.nav-item[data-page="${page}"]`);
    el("pageTitle").textContent = active ? active.querySelector("b").textContent : t("navHome");
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function renderAll() { renderHome(); renderTasks(); renderNotes(); renderBudget(); renderShopping(); }
  function renderHome() {
    el("statTasks").textContent = data.tasks.filter(x=>!x.done).length;
    el("statNotes").textContent = data.notes.length;
    el("statShopping").textContent = data.shopping.filter(x=>!x.done).length;
    const month = todayISO().slice(0,7);
    const spend = data.expenses.filter(x=>String(x.date||"").startsWith(month)).reduce((s,x)=>s+Number(x.amount||0),0);
    el("statSpend").textContent = formatMoney(spend);
    const next = data.tasks.filter(x=>!x.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999")).slice(0,4);
    const host = el("homeTasks"); host.innerHTML = ""; host.dataset.empty = t("noTasks");
    next.forEach(task => {
      const row = document.createElement("div"); row.className = "compact-row";
      row.innerHTML = `<button class="check-button" aria-label="${escapeHTML(t("done"))}" data-home-check="${task.id}"></button><div class="row-main"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.due ? `${t("due")}: ${formatDate(task.due)}` : t("pending"))}</small></div>`;
      host.appendChild(row);
    });
  }
  function renderTasks() {
    const host = el("tasksList"); host.innerHTML = "";
    let items = data.tasks.filter(x => taskFilter==="all" || (taskFilter==="open"&&!x.done) || (taskFilter==="done"&&x.done));
    items.sort((a,b)=>(a.done-b.done)||(a.due||"9999").localeCompare(b.due||"9999"));
    el("taskCount").textContent = `${items.length}`;
    if (!items.length) { host.innerHTML = `<div class="empty-message">${escapeHTML(t("noTasks"))}</div>`; return; }
    items.forEach(task => {
      const row = document.createElement("div"); row.className = `item-row ${task.done?"completed":""}`;
      row.innerHTML = `<button class="check-button" data-task-check="${task.id}" aria-label="${escapeHTML(t("done"))}">${task.done?"✓":""}</button><div class="row-main"><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.due ? `${t("due")}: ${formatDate(task.due)}` : t("noDueDate"))}</small></div><div class="row-actions"><button class="icon-button" data-task-delete="${task.id}" aria-label="${escapeHTML(t("delete"))}">✕</button></div>`;
      host.appendChild(row);
    });
  }
  function renderNotes() {
    const host = el("notesList"); host.innerHTML = "";
    if (!data.notes.length) { host.innerHTML = `<div class="empty-message">${escapeHTML(t("noNotes"))}</div>`; return; }
    data.notes.slice().sort((a,b)=>b.created-a.created).forEach(note => {
      const card = document.createElement("article"); card.className = "note-card";
      card.innerHTML = `<h3>${escapeHTML(note.title || t("emptyTitle"))}</h3><p>${escapeHTML(note.body)}</p><footer><span>${escapeHTML(formatDate(note.date))}</span><button class="icon-button" data-note-delete="${note.id}" aria-label="${escapeHTML(t("delete"))}">✕ ${escapeHTML(t("delete"))}</button></footer>`;
      host.appendChild(card);
    });
  }
  function renderBudget() {
    el("budgetLimit").value = data.budgetLimit || "";
    el("currency").value = data.currency || "MAD";
    const month = todayISO().slice(0,7);
    const spent = data.expenses.filter(x=>String(x.date||"").startsWith(month)).reduce((s,x)=>s+Number(x.amount||0),0);
    el("budgetLimitDisplay").textContent = formatMoney(data.budgetLimit);
    el("budgetSpentDisplay").textContent = formatMoney(spent);
    el("budgetRemainingDisplay").textContent = formatMoney(Number(data.budgetLimit||0)-spent);
    const host = el("expensesList"); host.innerHTML = "";
    const items = data.expenses.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
    if (!items.length) host.innerHTML = `<div class="empty-message">${escapeHTML(t("noExpenses"))}</div>`;
    items.forEach(item => {
      const row = document.createElement("div"); row.className = "item-row";
      row.innerHTML = `<div class="row-main"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(formatDate(item.date))}</small></div><strong>${escapeHTML(formatMoney(item.amount))}</strong><button class="icon-button" data-expense-delete="${item.id}" aria-label="${escapeHTML(t("delete"))}">✕</button>`;
      host.appendChild(row);
    });
  }
  function renderShopping() {
    const host = el("shoppingList"); host.innerHTML = "";
    const done = data.shopping.filter(x=>x.done).length;
    el("shoppingProgress").textContent = t("itemsProgress").replace("{done}",done).replace("{total}",data.shopping.length);
    if (!data.shopping.length) { host.innerHTML = `<div class="empty-message">${escapeHTML(t("noShopping"))}</div>`; return; }
    data.shopping.forEach(item => {
      const row = document.createElement("div"); row.className = `item-row ${item.done?"completed":""}`;
      row.innerHTML = `<button class="check-button" data-shop-check="${item.id}" aria-label="${escapeHTML(t("done"))}">${item.done?"✓":""}</button><div class="row-main"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.qty || "")}</small></div><button class="icon-button" data-shop-delete="${item.id}" aria-label="${escapeHTML(t("delete"))}">✕</button>`;
      host.appendChild(row);
    });
  }
  function addTask(title,due) {
    data.tasks.push({id:uid(),title:title.trim(),due:due||"",done:false,created:Date.now()}); saveData(); renderAll(); showToast(t("taskAdded"));
  }
  function exportData() {
    const blob = new Blob([JSON.stringify({...data, exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`sahlha-backup-${todayISO()}.json`; a.click(); URL.revokeObjectURL(url); showToast(t("exportSuccess"));
  }
  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || !Array.isArray(parsed.tasks)||!Array.isArray(parsed.notes)||!Array.isArray(parsed.expenses)||!Array.isArray(parsed.shopping)) throw new Error("Invalid backup");
        data = {...defaultData(),...parsed}; delete data.exportedAt; saveData(); applyLanguage(); showToast(t("importSuccess"));
      } catch { showToast(t("importError")); }
    };
    reader.readAsText(file);
  }
  function safeCalculate(expression) {
    const exp = expression.replace(/\s/g,"");
    if (!exp || !/^[0-9+\-*/().%]+$/.test(exp) || /[*/%+\-.]{2,}$/.test(exp)) throw new Error("Invalid");
    // Only arithmetic characters are allowed. No identifiers or function calls can enter this expression.
    const result = Function(`"use strict"; return (${exp})`)();
    if (!Number.isFinite(result)) throw new Error("Invalid");
    return String(Math.round((result + Number.EPSILON) * 1e8) / 1e8);
  }

  document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>setPage(btn.dataset.page)));
  document.querySelectorAll("[data-goto]").forEach(btn=>btn.addEventListener("click",()=>setPage(btn.dataset.goto)));
  el("languageSelect").addEventListener("change",e=>{data.language=e.target.value;saveData();applyLanguage();showToast(t("languageChanged"));});
  el("taskForm").addEventListener("submit",e=>{e.preventDefault();const title=el("taskTitle").value.trim();if(!title)return;addTask(title,el("taskDue").value);e.target.reset();});
  el("taskFilters").addEventListener("click",e=>{const btn=e.target.closest("[data-filter]");if(!btn)return;taskFilter=btn.dataset.filter;el("taskFilters").querySelectorAll("button").forEach(b=>b.classList.toggle("selected",b===btn));renderTasks();});
  el("noteForm").addEventListener("submit",e=>{e.preventDefault();const title=el("noteTitle").value.trim();const body=el("noteBody").value.trim();if(!title||!body)return;data.notes.push({id:uid(),title,body,date:todayISO(),created:Date.now()});saveData();renderAll();e.target.reset();showToast(t("noteSaved"));});
  el("budgetLimitForm").addEventListener("submit",e=>{e.preventDefault();data.budgetLimit=Math.max(0,Number(el("budgetLimit").value)||0);data.currency=el("currency").value;saveData();renderAll();showToast(t("budgetSaved"));});
  el("expenseForm").addEventListener("submit",e=>{e.preventDefault();const name=el("expenseName").value.trim();const amount=Number(el("expenseAmount").value);if(!name||!Number.isFinite(amount)||amount<=0)return;data.expenses.push({id:uid(),name,amount,date:el("expenseDate").value||todayISO(),created:Date.now()});saveData();renderAll();e.target.reset();el("expenseDate").value=todayISO();showToast(t("expenseAdded"));});
  el("shoppingForm").addEventListener("submit",e=>{e.preventDefault();const name=el("shoppingName").value.trim();if(!name)return;data.shopping.push({id:uid(),name,qty:el("shoppingQty").value.trim(),done:false,created:Date.now()});saveData();renderAll();e.target.reset();showToast(t("itemAdded"));});
  document.body.addEventListener("click",e=>{
    const target=e.target.closest("button");if(!target)return;
    if(target.dataset.taskCheck){const item=data.tasks.find(x=>x.id===target.dataset.taskCheck);if(item)item.done=!item.done;saveData();renderAll();showToast(t("taskDone"));}
    if(target.dataset.homeCheck){const item=data.tasks.find(x=>x.id===target.dataset.homeCheck);if(item)item.done=true;saveData();renderAll();showToast(t("taskDone"));}
    if(target.dataset.taskDelete && confirm(t("confirmDelete"))){data.tasks=data.tasks.filter(x=>x.id!==target.dataset.taskDelete);saveData();renderAll();showToast(t("deleted"));}
    if(target.dataset.noteDelete && confirm(t("confirmDelete"))){data.notes=data.notes.filter(x=>x.id!==target.dataset.noteDelete);saveData();renderAll();showToast(t("deleted"));}
    if(target.dataset.expenseDelete && confirm(t("confirmDelete"))){data.expenses=data.expenses.filter(x=>x.id!==target.dataset.expenseDelete);saveData();renderAll();showToast(t("deleted"));}
    if(target.dataset.shopCheck){const item=data.shopping.find(x=>x.id===target.dataset.shopCheck);if(item)item.done=!item.done;saveData();renderAll();}
    if(target.dataset.shopDelete && confirm(t("confirmDelete"))){data.shopping=data.shopping.filter(x=>x.id!==target.dataset.shopDelete);saveData();renderAll();showToast(t("deleted"));}
  });
  el("clearExpenses").addEventListener("click",()=>{if(confirm(t("confirmClearExpenses"))){data.expenses=[];saveData();renderAll();showToast(t("deleted"));}});
  el("clearChecked").addEventListener("click",()=>{data.shopping=data.shopping.filter(x=>!x.done);saveData();renderAll();showToast(t("deleted"));});
  el("exportBtn").addEventListener("click",exportData);
  el("importInput").addEventListener("change",e=>{const file=e.target.files?.[0];if(file)importData(file);e.target.value="";});
  el("calcDisplay").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();try{el("calcDisplay").value=safeCalculate(el("calcDisplay").value);}catch{showToast(t("badCalculation"));}}});
  document.querySelector(".calc-keys").addEventListener("click",e=>{
    const key=e.target.closest("[data-calc]")?.dataset.calc;if(!key)return;const display=el("calcDisplay");
    if(key==="clear")display.value="0";
    else if(key==="back")display.value=display.value.length>1?display.value.slice(0,-1):"0";
    else if(key==="="){try{display.value=safeCalculate(display.value);}catch{showToast(t("badCalculation"));}}
    else display.value=display.value==="0"&&![".","+","-","*","/","(",")"].includes(key)?key:display.value+key;
  });
  window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;el("installBtn").classList.remove("hidden");});
  el("installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;el("installBtn").classList.add("hidden");});
  el("expenseDate").value=todayISO();
  if("serviceWorker" in navigator && location.protocol!=="file:") window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(err=>console.warn("Service worker registration failed",err)));
  applyLanguage();
})();