// تبديل الخيار الافتراضي
    function toggleDefaultOption() {
        var selectElement = document.getElementById("targetLang");
        var defaultOption = document.getElementById("defaultOption");
        if (selectElement.value !== "default") {
            defaultOption.style.display = "none";
        } else {
            defaultOption.style.display = "block";
        }
    }

    // حفظ بيانات البحث
    function saveSearchData(query, category, searchEngine) {
        localStorage.setItem("lastQuery", query);
        localStorage.setItem("selectedCategory", category);
        localStorage.setItem("lastSearchEngine", searchEngine);
    }

    // تبديل ظهور زر المسح
    function toggleClearButton() {
        const searchQuery = document.getElementById("searchQuery").value;
        const clearButton = document.getElementById("clearButton");
        clearButton.style.display = searchQuery ? 'block' : 'none';
    }

    // مسح البحث
    function clearSearch() {
        document.getElementById("searchQuery").value = '';
        toggleClearButton();
    }
    
    // تنفيذ البحث عند الضغط على Enter
    document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        performSearch();
    }
});

document.getElementById("searchEnginesDropdown").addEventListener("change", performSearch);

function performSearch() {
    let searchQuery = document.getElementById("searchInput").value.trim();
    let selectedEngine = document.getElementById("searchEnginesDropdown").value;

    if (!searchQuery) return; // إذا لم يتم إدخال نص في البحث، لا تفعل شيئًا

    let searchUrl = selectedEngine ? selectedEngine + encodeURIComponent(searchQuery) 
                                   : "https://www.google.com/search?q=" + encodeURIComponent(searchQuery);

    window.open(searchUrl, "_blank"); // فتح البحث في نافذة جديدة
}

    // تصفية محركات البحث بناءً على الفئة
    function filterSearchEngines(category) {
        const searchEnginesDropdown = document.getElementById("searchEnginesDropdown");
        let firstVisibleOption = null;

        Array.from(searchEnginesDropdown.options).forEach(option => {
            if (category === "all" || option.getAttribute("data-category") === category) {
                option.style.display = "block";
                if (!firstVisibleOption) {
                    firstVisibleOption = option; // تعيين أول خيار مرئي
                }
            } else {
                option.style.display = "none";
            }
        });
// منع قائمة النقر بزر الفأرة الأيمن، باستثناء مربع النص searchQuery
document.addEventListener('contextmenu', function(e) {
    if (e.target.id !== 'searchQuery') { // تحقق من أن العنصر ليس مربع النص
        e.preventDefault(); // منع ظهور قائمة النقر بزر الفأرة الأيمن
    }
});

// منع تحديد النصوص بالماوس، باستثناء مربع النص searchQuery
document.addEventListener('selectstart', function(e) {
    if (e.target.id !== 'searchQuery') { // تحقق من أن العنصر ليس مربع النص
        e.preventDefault();
    }
});

// منع استخدام اختصار Ctrl + A، باستثناء مربع النص searchQuery
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'a' && e.target.id !== 'searchQuery') {
        e.preventDefault();
        alert('Text selection has been disabled.');
    }
});
      
        // تعيين الخيار الأول المرئي كخيار محدد
        if (firstVisibleOption) {
            searchEnginesDropdown.selectedIndex = Array.from(searchEnginesDropdown.options).indexOf(firstVisibleOption);
        }
    }

    // حفظ الفئة المحددة
    function saveSelectedCategory(category) {
        localStorage.setItem("selectedCategory", category);
    }

    // استعادة الفئة المحددة عند تحميل الصفحة
    function restoreSelectedCategory() {
        const savedCategory = localStorage.getItem("selectedCategory");
        if (savedCategory) {
            filterSearchEngines(savedCategory);
            document.querySelectorAll('.category-button').forEach(button => {
                if (button.getAttribute('data-category') === savedCategory) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        }
    }

    // استعادة محرك البحث المحدد عند تحميل الصفحة
    function restoreSelectedSearchEngine() {
        const savedSearchEngine = localStorage.getItem("lastSearchEngine");
        if (savedSearchEngine) {
            const searchEnginesDropdown = document.getElementById("searchEnginesDropdown");
            for (let i = 0; i < searchEnginesDropdown.options.length; i++) {
                if (searchEnginesDropdown.options[i].value === savedSearchEngine) {
                    searchEnginesDropdown.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // وضع المؤشر في مربع النص وتحديد النص إذا كان موجودًا
    function focusAndSelectSearchQuery() {
        const searchQuery = document.getElementById("searchQuery");
        searchQuery.focus();
        if (searchQuery.value) {
            searchQuery.select();
        }
    }

    // تنفيذ البحث
    function performSearch() {
        const query = document.getElementById("searchQuery").value;
        const engineDropdown = document.getElementById("searchEnginesDropdown");
        const selectedOption = engineDropdown.options[engineDropdown.selectedIndex];

        if (query && selectedOption) {
            const baseURL = selectedOption.getAttribute("data-base");
            const suffix = selectedOption.getAttribute("data-suffix");
            let fullUrl = baseURL + encodeURIComponent(query) + suffix;

            saveSearchData(query, document.querySelector('.category-button.active').getAttribute('data-category'), selectedOption.value);

            if (selectedOption.text === "ChatGPT_الصق_فقط_في_الشات") {
                navigator.clipboard.writeText(query).then(() => {
                    console.log('تم نسخ النص إلى الحافظة بنجاح!');
                }).catch(err => {
                    console.error('فشل نسخ النص إلى الحافظة: ', err);
                });
            }

            if (isAndroid()) {
                fullUrl = "intent://" + fullUrl.replace(/^https?:\/\//, "") + "#Intent;scheme=https;package=com.android.chrome;end;";
            }

            window.location.href = fullUrl;
        } else {
            alert("يرجى إدخال كلمة البحث واختيار محرك البحث.");
        }
    }

    // التحقق من نظام التشغيل
    function isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    let originalText = "";
let isTranslated = false;

async function translateText() {
    const query = document.getElementById("searchQuery").value;
    const targetLang = document.getElementById("targetLang").value;

    if (!query) {
        return alert("يرجى إدخال نص");
    }

    if (isTranslated) {
        document.getElementById("searchQuery").value = originalText;
        isTranslated = false;
        return;
    }

    try {
        // ترجمة النص إلى الإنجليزية أولاً
        const urlToEnglish = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(query)}`;
        const responseToEnglish = await fetch(urlToEnglish);
        const dataToEnglish = await responseToEnglish.json();
        const englishText = dataToEnglish[0].map(item => item[0]).join('');

        // إذا كانت اللغة الهدف غير الإنجليزية، ترجمة النص الإنجليزي إلى اللغة الهدف
        if (targetLang !== 'en') {
            const urlToTarget = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(englishText)}`;
            const responseToTarget = await fetch(urlToTarget);
            const dataToTarget = await responseToTarget.json();
            const translatedText = dataToTarget[0].map(item => item[0]).join('');
            
            originalText = query;
            document.getElementById("searchQuery").value = translatedText;
        } else {
            originalText = query;
            document.getElementById("searchQuery").value = englishText;
        }

        isTranslated = true;
    } catch (error) {
        console.error(error);
        alert("خطأ في الترجمة.");
    }
}

    // إضافة حدث النقر لأزرار الفئات
    document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterSearchEngines(this.getAttribute('data-category'));
            saveSelectedCategory(this.getAttribute('data-category'));
        });
    });

    // استدعاء focusAndSelectSearchQuery عند تحميل الصفحة
    window.onload = function() {
        focusAndSelectSearchQuery();
        restoreSelectedCategory();
        restoreSelectedSearchEngine();
    };
      function toggleClearButton() {
    var searchQuery = document.getElementById('searchQuery');
    var clearButton = document.getElementById('clearButton');
    clearButton.style.display = searchQuery.value ? 'inline' : 'none';
}

function clearSearch() {
    document.getElementById('searchQuery').value = '';
    toggleClearButton();
}

// التعرف على الصوت
var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.maxAlternatives = 1;


var isRecording = false;

function toggleRecording() {
    if (isRecording) {
        recognition.stop();
        document.getElementById('startStopBtn').innerHTML = '<i class="fas fa-microphone"></i>'; // إعادة أيقونة الميكروفون عند التوقف
    } else {
        recognition.start();
        document.getElementById('startStopBtn').innerHTML = '🛑'; // تغيير النص إلى أيقونة التوقف
    }
    isRecording = !isRecording;
}

recognition.onresult = function(event) {
    let transcript = event.results[0][0].transcript;
    document.getElementById('searchQuery').value = transcript;
    toggleClearButton(); // عرض زر المسح إذا كانت هناك نتيجة
};

recognition.onend = function() {
    if (isRecording) {
        document.getElementById('startStopBtn').innerHTML = '<i class="fas fa-microphone"></i>'; // إعادة أيقونة الميكروفون عند التوقف
        isRecording = false;
    }
};
      
    //الخيار الافتراضي   
      document.addEventListener("DOMContentLoaded", function() {
    // جعل الخيار الافتراضي نشطًا عند تحميل الصفحة
    let defaultButton = document.querySelector(".category-button[data-category='all']");
    if (defaultButton) {
        defaultButton.classList.add("active");
    }

    // إضافة حدث النقر لإزالة التحديد عن الأزرار الأخرى
    document.querySelectorAll(".category-button").forEach(button => {
        button.addEventListener("click", function() {
            // إزالة التحديد عن جميع الأزرار
            document.querySelectorAll(".category-button").forEach(btn => btn.classList.remove("active"));
            
            // تفعيل الزر المحدد
            this.classList.add("active");
        });
    });
});
      
// منع
document.addEventListener("keydown", function(e) {
  // منع Ctrl+U (عرض شفرة المصدر)
  if (e.ctrlKey && (e.key.toLowerCase() === 'u')) {
    e.preventDefault();
    alert("تم تعطيل عرض شفرة المصدر.");
    return false;
  }
  
  // منع Ctrl+Shift+I أو Ctrl+Shift+J (أدوات المطور)
  if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) {
    e.preventDefault();
    
    return false;
  }
  
  // منع F12 (فتح أدوات المطور)
  if (e.key === "F12") {
    e.preventDefault();
    
    return false;
  }
});