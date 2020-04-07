const cz = {
  navigation: {
    applications: "Aplikace",
    dashboard: "Přístrojová deska",
    companies: "Společnosti",
    history: "Dějiny",
    requestCompany: "Zeptejte se společnosti",
    analysis: "Analýza",
    login: "Přihlásit se",
    register: "Registrovat"
  },
  languages: {
    en: "English",
    cz: "Čeština",
    language: "Jazyk"
  },
  loginPage: {
    title: "PŘIHLÁSIT SE NA VÁŠ ÚČET",
    username: "Uživatelské jméno",
    password: "Heslo",
    rememberMe: "Zapamatuj si mě",
    forgotPassword: "Zapomenuté heslo?",
    login: "Přihlásit se",
    or: "NEBO",
    noAccount: "Nemáte účet?",
    register: "Vytvořit účet",
    invalidUsername: "Neplatné uživatelské jméno",
    invalidPassword: "Neplatné heslo",
    hints: {
      username: {
        h1: "Uživatelské jméno rozlišuje velká a malá písmena",
        h2: "Musí začínat malým písmenem / velkým písmenem",
        h3: "Může obsahovat čísla",
        h4: "Povoleny jsou pouze [-], [_]",
        h5: "Minimálně 5 znaků a max. 15 znaků"
      },
      password: {
        h1: "Heslo rozlišuje velká a malá písmena",
        h2: "Musí začít obsahovat malé písmeno",
        h3: "Musí začínat velkým písmenem",
        h4: "Musí začít obsahovat číslo",
        h5: "Nejméně 8 znaků"
      }
    }
  },
  registerPage: {
    title: "Vytvořit účet",
    username: "Uživatelské jméno",
    email: "E-mailem",
    password: "Heslo",
    confirmPassword: "Potvrďte heslo",
    createAccount: "Vytvořit účet",
    haveAccount: "Máte již účet?",
    login: "Přihlásit se",
    invalidUsername: "Neplatné uživatelské jméno",
    invalidEmail: "Neplatný e-mail",
    invalidPassword: "Neplatné heslo",
    passwordNoMatch: "Hesla se neshodují",
    hints: {
      username: {
        h1: "Uživatelské jméno rozlišuje velká a malá písmena",
        h2: "Musí začínat malým písmenem / velkým písmenem",
        h3: "Může obsahovat čísla",
        h4: "Povoleny jsou pouze [-], [_]",
        h5: "Minimálně 5 znaků a max. 15 znaků"
      },
      password: {
        h1: "Heslo rozlišuje velká a malá písmena",
        h2: "Musí začít obsahovat malé písmeno",
        h3: "Musí začínat velkým písmenem",
        h4: "Musí začít obsahovat číslo",
        h5: "Nejméně 8 znaků"
      }
    }
  },
  confirmPage: {
    confirmAddress: "Potvrďte svou emailovou adresu!",
    confirmationSent: "Potvrzovací kód byl odeslán na",
    confirmationCode: "Potvrzovací kód",
    confirm: "Potvrdit",
    backToLogin: "Vraťte se k přihlášení",
    invalidConfirmationCode: "Neplatný potvrzovací kód"
  },
  forgotPassword: {
    recovertTitle: "Obnov své heslo",
    username: "Uživatelské jméno",
    sendCode: "Odeslat resetovací kód",
    backToLogin: "Vraťte se k přihlášení",
    invalidUsername: "Neplatné uživatelské jméno"
  },
  resetPassword: {
    title: "Obnovit heslo",
    username: "Uživatelské jméno",
    password: "Heslo",
    confirmPassword: "Potvrďte heslo",
    confirmationCode: "Potvrzovací kód",
    resetButton: "Obnovit moje heslo",
    backToLogin: "Vraťte se k přihlášení",
    invalidUsername: "Neplatné uživatelské jméno",
    invalidPassword: "Neplatné heslo",
    passwordNoMatch: "Hesla se neshodují",
    invalidConfirmationCode: "Neplatný potvrzovací kód"
  },
  companiesPage: {
    companies: "Společnosti",
    favoriteCompanies: "Oblíbené společnosti",
    deleteBtn: "Odstranit",
    addCompanies: "Přidejte další společnosti",
    addBtn: "Přidat",
    search: "Vyhledávání",
    empty: "Žádné společnosti k zobrazení."
  },

  companyProfile: {
    relatedArticles: "Související články",
    currentWeek: "Ceny aktuálního týdne",
    nextWeek: "Předpověď na příští týden",
    high: "Aktuální týden je vysoká",
    low: "Aktuální týden je nízký",
    volume: "Objem aktuálního týdne",
    companyDetails: {
      detailsHistory: "Podrobnosti a historie",
      name: "Jméno",
      revenue: "Příjmy",
      ceo: "Výkonný ředitel",
      creationDate: "Datum vzniku",
      description: "Popis",
      industries: "Průmyslová odvětví",
      employees: "Zaměstnanci",
      hq: "Hlavní sídlo",
      visit: "Navštívit stránku"
    },
    stockHistoryTable: {
      stockHistory: "Historie cen akcií",
      dateFrom: "Datum od",
      dateTo: "Datum do",
      filterBtn: "Filtr",
      noData: "Vybraným datům neodpovídají žádná data."
    }
  },

  userMenu: {
    myProfile: "Můj profil",
    logout: "Odhlásit se"
  },

  profilePage: {
    profile: "Profil",
    contactInfo: {
      title: "Kontaktní informace",
      username: "Uživatelské jméno",
      firstName: "Jméno",
      lastName: "Příjmení",
      position: "Pozice",
      updateBtn: "Aktualizace"
    },
    accountInfo: {
      title: "Informace o účtu",
      currentPassword: "Aktuální h eslo",
      newPassword: "Nové heslo",
      confirmPassword: "Potvrďte heslo",
      updatePasswordBtn: "Aktualizujte heslo",
      deleteAccBtn: "Smazat můj účet!"
    }
  },

  analysisPage: {
    filter: {
      model: "Modelka",
      company: "Společnost",
      date: "Datum",
      status: "Postavení",
      clearBtn: "Vymazat filtry",
      none: "Žádný",
      failed: "Selhalo",
      pending: "Čekající",
      created: "Vytvořeno"
    },
    table: {
      model: "Modelka",
      company: "Společnost",
      date: "Datum",
      status: "Postavení",
      actions: "Akce",
      noData: "Vašim kritériím neodpovídají žádné modely.",
      deleteModalTitle: "Smazat model!",
      areYouSure: "Opravdu chcete tento model smazat?",
      confirm: "Potvrdit",
      cancel: "Zrušení"
    }
  },
  viewModelPage: {
    cancelBtn: "Zrušení",
    saveBtn: "Uložit",
    header: {
      compareBtn: "Porovnejte",
      exportBtn: "Vývozní",
      createModel: "Vytvořte model",
      noModels: "Nejsou k dispozici žádné modely k porovnání.",
      noModelsCriteria: "Vašim kritériím neodpovídají žádné modely.",
      chooseToCompare: "Vyberte model, který chcete porovnat",
      closeBtn: "Zavřít",
      copyBtn: "Kopírovat",

      model: "Modelka",
      company: "Společnost",
      all: "Všechno"
    },
    datasetControl: {
      title: "Ovládání datové sady",
      company: "Společnost",
      modelTitle: "Název Modelu",
      modelTitleTooltip: "Zobrazovaný název pro snadný přístup.",
      companyTooltip: "Společnost, kterou budete používat k tréninku modelu",
      none: "Žádný",
      loading: "Načítání..."
    },
    features: {
      title: "Funkce",
      featuresTooltip:
        "Funkce, které budete používat pro trénink vašeho modelu",
      open: "Vyvolávací cena",
      close: "Závěrečná cena",
      low: "Minimální cena dne",
      high: "Maximální cena dne",
      volume: "Výměnný objem",
      loading: "Načítání..."
    },
    featureToPredict: {
      title: "Funkce předvídat",
      featureToPredictTooltip:
        "Kterou funkci chcete, aby váš model předpovídal",
      open: "Vyvolávací cena",
      close: "Závěrečná cena",
      low: "Minimální cena dne",
      high: "Maximální cena dne",
      volume: "Výměnný objem",
      loading: "Načítání..."
    },
    modelControl: {
      title: "Řízení modelu",
      more: "Více o tomto modelu strojového učení",
      model: "Modelu",
      modelTooltip: "Algoritmus, který použijete pro trénink vašeho modelu",
      none: "Načítání...",
      forecastOut: "Předpověď",
      forecastOutTooltip: "Kolik dní v budoucnosti chceme udělat předpovědi",
      testSize: "Velikost testu",
      testSizeTooltip: "Velikost souboru dat testu v procentech %.",
      randomState: "Náhodný stav",
      randomStateTooltip:
        "Semeno generátoru pseudonáhodných čísel, který vybere náhodnou funkci pro aktualizaci.",
      l1Ratio: {
        elastic: "Pokud se váha sblíží, zastavte algoritmus"
      },
      eps: {
        lassoLars:
          "Strojově přesná regularizace při výpočtu Choleských diagonálních faktorů"
      },
      fitPath: {
        lassoLars:
          "Strojově přesná regularizace při výpočtu Choleských diagonálních faktorů..."
      },
      solver: {
        ridge: "Řešitel pro použití ve výpočetních rutinách"
      },
      alpha2: {
        bayesianRidge:
          "Inverzní měřítko (parametr rate) pro distribuci gama před parametrem alfa"
      },
      lambda1: {
        bayesianRidge: "Parametr tvaru pro distribuci gama před parametrem alfa"
      },
      lambda2: {
        bayesianRidge:
          "Inverzní měřítko (parametr rate) pro distribuci gama před parametrem alfa"
      },
      computeScore: {
        bayesianRidge:
          "Vypočítejte mezní pravděpodobnost protokolu při každé iteraci optimalizace"
      },
      positive: {
        elastic: "Vynutí nucené koeficienty",
        lasso: "Vynutí nucené koeficienty",
        lassoLars:
          "Pod kladným omezením nebudou koeficienty modelu konvergovat k obyčejnému řešení nejmenších čtverců pro malé hodnoty alfa"
      },
      warmStart: {
        elastic:
          "Znovu využijte řešení předchozího hovoru, aby se hodilo jako inicializace, nebo jednoduše vymažte předchozí řešení",
        lasso:
          "Znovu využijte řešení předchozího hovoru, aby se hodilo jako inicializace, nebo jednoduše vymažte předchozí řešení",
        randomForest:
          "Znovu využijte řešení předchozího hovoru, aby se hodilo jako inicializace, nebo jednoduše vymažte předchozí řešení"
      },
      preCompute: {
        elastic:
          "Zda se použije předem vypočítaná Gramova matice k urychlení výpočtů",
        lasso:
          "Zda se použije předem vypočítaná Gramova matice k urychlení výpočtů",
        lassoLars:
          "Zda se použije předem vypočítaná Gramova matice k urychlení výpočtů"
      },
      normalize: {
        linear:
          "Pokud je False, bude regresor normalizován před regresí odečtením střední hodnoty a dělením normou L2",
        elastic:
          "Pokud je False, bude regresor normalizován před regresí odečtením střední hodnoty a dělením normou L2",
        lasso:
          "Pokud je False, bude regresor normalizován před regresí odečtením střední hodnoty a dělením normou L2",
        lassoLars:
          "Pokud je False, bude regresor normalizován před regresí odečtením střední hodnoty a dělením normou L2",
        ridge:
          "Pokud je False, bude regresor normalizován před regresí odečtením střední hodnoty a dělením normou L2",
        bayesianRidge:
          "Pokud je False, bude regresor normalizován před regresí odečtením střední hodnoty a dělením normou L2"
      },
      fitIntercept: {
        linear: "Zda vypočítat průnik pro model",
        elastic: "Zda vypočítat průnik pro model",
        lasso: "Zda vypočítat průnik pro model",
        lassoLars: "Zda vypočítat průnik pro model",
        ridge: "Zda vypočítat průnik pro model",
        bayesianRidge: "Zda vypočítat průnik pro model"
      },
      selection: {
        elastic:
          "Pokud je nastavena na náhodnou hodnotu, náhodný koeficient se aktualizuje každou iteraci namísto opakování ve výchozím nastavení postupně",
        lasso:
          "Pokud je nastavena na náhodnou hodnotu, náhodný koeficient se aktualizuje každou iteraci namísto opakování ve výchozím nastavení postupně"
      },
      tol: {
        elastic: "Tolerance pro optimalizaci",
        lasso: "Tolerance pro optimalizaci",
        ridge: "Přesnost řešení",
        bayesianRidge: "Pokud se váha sblíží, zastavte algoritmus"
      },
      maxIteration: {
        elastic: "Maximální počet iterací",
        lasso: "Maximální počet iterací",
        lassoLars: "Maximální počet iterací",
        ridge: "Maximální počet iterací",
        bayesianRidge: "Maximální počet iterací"
      },
      alpha: {
        elastic: "Konstanta, která násobí penalizační podmínky",
        lasso: "Konstanta, která násobí penalizační podmínky",
        lassoLars: "Konstanta, která násobí penalizační podmínky",
        ridge: "Pravidelná síla; musí být pozitivní float",
        bayesianRidge:
          "Parametr tvaru pro distribuci gama před parametrem alfa",
        decisionTree: "Konstanta, která násobí penalizační podmínky"
      },
      presort: {
        decisionTree:
          "Zda je třeba přednastavit data, aby se urychlilo nalezení nejlepších mezer v montáži",
        randomForest:
          "Zda je třeba přednastavit data, aby se urychlilo nalezení nejlepších mezer v montáži"
      },
      criterion: {
        decisionTree: "Funkce pro měření kvality rozdělení",
        randomForest: "Funkce pro měření kvality rozdělení"
      },
      splitter: {
        decisionTree: "Strategie použitá k výběru rozdělení v každém uzlu",
        randomForest: "Strategie použitá k výběru rozdělení v každém uzlu",
        Adam: "Strategie použitá k výběru rozdělení v každém uzlu"
      },
      maxDepth: {
        decisionTree: "Maximální hloubka stromu",
        randomForest: "Maximální hloubka stromu"
      },
      minSamplesSplit: {
        decisionTree:
          "Minimální počet vzorků potřebných k rozdělení interního uzlu",
        randomForest:
          "Minimální počet vzorků potřebných k rozdělení interního uzlu"
      },
      minSamplesLeaf: {
        decisionTree: "Minimální počet vzorků, které musí být v uzlu listu",
        randomForest: "Minimální počet vzorků, které musí být v uzlu listu"
      },
      maxFeatures: {
        decisionTree:
          "Počet funkcí, které je třeba zvážit při hledání nejlepšího rozdělení",
        randomForest:
          "Počet funkcí, které je třeba zvážit při hledání nejlepšího rozdělení"
      },
      maxLeafNodes: {
        decisionTree:
          "Růst stromu s max_leaf_nodes nejlepším způsobem. Nejlepší uzly jsou definovány jako relativní redukce nečistot",
        randomForest:
          "Růst stromu s max_leaf_nodes nejlepším způsobem. Nejlepší uzly jsou definovány jako relativní redukce nečistot"
      },
      minImpurityDecrease: {
        decisionTree:
          "Uzel bude rozdělen, pokud toto rozdělení vyvolá pokles nečistoty větší nebo rovný této hodnotě",
        randomForest:
          "Uzel bude rozdělen, pokud toto rozdělení vyvolá pokles nečistoty větší nebo rovný této hodnotě"
      },
      bootstrap: {
        randomForest: "Zda se při vytváření stromů používají vzorky bootstrapu"
      },
      nEstimators: {
        randomForest: "Počet stromů v lese"
      },
      oobScore: {
        randomForest:
          "Zda se použijí vzorky z vaku pro odhad R2 na neviditelných datech"
      },
      epochs: {
        Adam: "Kolikrát bude tato síť iterovat přes data školení",
        Adamax: "Kolikrát bude tato síť iterovat přes data školení",
        Nadam: "Kolikrát bude tato síť iterovat přes data školení",
        SGD: "Kolikrát bude tato síť iterovat přes data školení",
        RMSprop: "Kolikrát bude tato síť iterovat přes data školení",
        Adadelta: "Kolikrát bude tato síť iterovat přes data školení"
      },
      seqLen: {
        Adam:
          "Akciové ceny musí být předem zpracovány tak, aby představovaly každou následující skladovou zásobu jako jednu sekvenci",
        Adamax:
          "Akciové ceny musí být předem zpracovány tak, aby představovaly každou následující skladovou zásobu jako jednu sekvenci",
        Nadam:
          "Akciové ceny musí být předem zpracovány tak, aby představovaly každou následující skladovou zásobu jako jednu sekvenci",
        SGD:
          "Akciové ceny musí být předem zpracovány tak, aby představovaly každou následující skladovou zásobu jako jednu sekvenci",
        RMSprop:
          "Akciové ceny musí být předem zpracovány tak, aby představovaly každou následující skladovou zásobu jako jednu sekvenci",
        Adadelta:
          "Akciové ceny musí být předem zpracovány tak, aby představovaly každou následující skladovou zásobu jako jednu sekvenci"
      },
      batchSize: {
        Adam:
          "Velikost šarže omezuje počet vzorků, které se mají zobrazit v síti před provedením aktualizace hmotnosti",
        Adamax:
          "Velikost šarže omezuje počet vzorků, které se mají zobrazit v síti před provedením aktualizace hmotnosti",
        Nadam:
          "Velikost šarže omezuje počet vzorků, které se mají zobrazit v síti před provedením aktualizace hmotnosti",
        SGD:
          "Velikost šarže omezuje počet vzorků, které se mají zobrazit v síti před provedením aktualizace hmotnosti",
        RMSprop:
          "Velikost šarže omezuje počet vzorků, které se mají zobrazit v síti před provedením aktualizace hmotnosti",
        Adadelta:
          "Velikost šarže omezuje počet vzorků, které se mají zobrazit v síti před provedením aktualizace hmotnosti"
      },
      networkUnits: {
        Adam:
          "Počet neuronů, které budou použity pro každou vrstvu sítě s výjimkou husté vrstvy",
        Adamax:
          "Počet neuronů, které budou použity pro každou vrstvu sítě s výjimkou husté vrstvy",
        Nadam:
          "Počet neuronů, které budou použity pro každou vrstvu sítě s výjimkou husté vrstvy",
        SGD:
          "Počet neuronů, které budou použity pro každou vrstvu sítě s výjimkou husté vrstvy",
        RMSprop:
          "Počet neuronů, které budou použity pro každou vrstvu sítě s výjimkou husté vrstvy",
        Adadelta:
          "Počet neuronů, které budou použity pro každou vrstvu sítě s výjimkou husté vrstvy"
      },
      networkLayers: {
        Adam: "Počet vrstev, které budou použity k vytvoření sítě",
        Adamax: "Počet vrstev, které budou použity k vytvoření sítě",
        Nadam: "Počet vrstev, které budou použity k vytvoření sítě",
        SGD: "Počet vrstev, které budou použity k vytvoření sítě",
        RMSprop: "Počet vrstev, které budou použity k vytvoření sítě",
        Adadelta: "Počet vrstev, které budou použity k vytvoření sítě"
      },
      dropOut: {
        Adam: "Dropout is a way to prevent over-fitting",
        Adamax: "Dropout is a way to prevent over-fitting",
        Nadam: "Dropout is a way to prevent over-fitting",
        SGD: "Dropout is a way to prevent over-fitting",
        RMSprop: "Dropout is a way to prevent over-fitting",
        Adadelta: "Dropout is a way to prevent over-fitting"
      },
      batchNormalization: {
        Adam: "Normalizuje aktivaci předchozí vrstvy v každé dávce",
        Adamax: "Normalizuje aktivaci předchozí vrstvy v každé dávce",
        Nadam: "Normalizuje aktivaci předchozí vrstvy v každé dávce",
        SGD: "Normalizuje aktivaci předchozí vrstvy v každé dávce",
        RMSprop: "Normalizuje aktivaci předchozí vrstvy v každé dávce",
        Adadelta: "Normalizuje aktivaci předchozí vrstvy v každé dávce"
      },
      metrics: {
        Adam: "K vyhodnocení modelu lze použít tři různé metriky",
        Adamax: "K vyhodnocení modelu lze použít tři různé metriky",
        Nadam: "K vyhodnocení modelu lze použít tři různé metriky",
        SGD: "K vyhodnocení modelu lze použít tři různé metriky",
        RMSprop: "K vyhodnocení modelu lze použít tři různé metriky",
        Adadelta: "K vyhodnocení modelu lze použít tři různé metriky"
      },
      scaler: {
        Adam: "Objekt, který mění měřítko dat",
        Adamax: "Objekt, který mění měřítko dat",
        Nadam: "Objekt, který mění měřítko dat",
        SGD: "Objekt, který mění měřítko dat",
        RMSprop: "Objekt, který mění měřítko dat",
        Adadelta: "Objekt, který mění měřítko dat"
      },
      loss: {
        Adam: "Míra chyb, kterých se síť dopustila při předpovídání výstupu",
        Adamax: "Míra chyb, kterých se síť dopustila při předpovídání výstupu",
        Nadam: "Míra chyb, kterých se síť dopustila při předpovídání výstupu",
        SGD: "Míra chyb, kterých se síť dopustila při předpovídání výstupu",
        RMSprop: "Míra chyb, kterých se síť dopustila při předpovídání výstupu",
        Adadelta: "Míra chyb, kterých se síť dopustila při předpovídání výstupu"
      },
      learningRate: {
        Adam: "Množství, které se během tréninku aktualizuje",
        Adamax: "Množství, které se během tréninku aktualizuje",
        Nadam: "Množství, které se během tréninku aktualizuje",
        SGD: "Množství, které se během tréninku aktualizuje",
        RMSprop: "Množství, které se během tréninku aktualizuje",
        Adadelta: "Množství, které se během tréninku aktualizuje"
      },
      beta1: {
        Adam: "Rychlost exponenciálního rozpadu pro odhady prvního okamžiku",
        Adamax: "Rychlost exponenciálního rozpadu pro odhady prvního okamžiku",
        Nadam: "Rychlost exponenciálního rozpadu pro odhady prvního okamžiku"
      },
      beta2: {
        Adam: "Rychlost exponenciálního rozpadu pro odhady druhého momentu",
        Adamax: "Rychlost exponenciálního rozpadu pro odhady druhého momentu",
        Nadam: "Rychlost exponenciálního rozpadu pro odhady druhého momentu"
      },
      epsilon: {
        Adam: "Malé číslo, které zabraňuje dělení nulou",
        Adamax: "Malé číslo, které zabraňuje dělení nulou",
        Nadam: "Malé číslo, které zabraňuje dělení nulou",
        RMSprop: "Malé číslo, které zabraňuje dělení nulou",
        Adadelta: "Malé číslo, které zabraňuje dělení nulou"
      },
      decay: {
        Adam:
          "Po každé aktualizaci se hmotnosti neuronové sítě vynásobí faktorem o něco méně než jedním",
        Adamax:
          "Po každé aktualizaci se hmotnosti neuronové sítě vynásobí faktorem o něco méně než jedním",
        SGD:
          "Po každé aktualizaci se hmotnosti neuronové sítě vynásobí faktorem o něco méně než jedním",
        RMSprop:
          "Po každé aktualizaci se hmotnosti neuronové sítě vynásobí faktorem o něco méně než jedním",
        Adadelta:
          "Po každé aktualizaci se hmotnosti neuronové sítě vynásobí faktorem o něco méně než jedním"
      },
      amsgrad: {
        Adam: "Zda se má použít varianta AMSGrad",
        Adamax: "Zda se má použít varianta AMSGrad",

        Nadam: "Zda se má použít varianta AMSGrad",
        SGD: "Zda se má použít varianta AMSGrad",
        RMSprop: "Zda se má použít varianta AMSGrad",
        Adadelta: "Zda se má použít varianta AMSGrad"
      },
      scheduleDecay: {
        Nadam:
          "Snižuje rychlost učení o daný faktor v každých několika epochách"
      },
      momentum: {
        SGD: "Parametr, který urychluje SGD v příslušném směru a tlumí kmitání"
      },
      nesterov: {
        SGD: "Zda použít Nesterov Momentum"
      },
      rho: {
        RMSprop:
          "Faktor úpadku nebo exponenciálně vážený průměr nad čtvercem gradientů",
        Adadelta:
          "Faktor úpadku nebo exponenciálně vážený průměr nad čtvercem gradientů"
      }
    },
    lossChartTitle: "Ztráta",
    futurePredictionsTitle: "Budoucí předpovědi",
    predVSrealChartTitle: "Předpověď VS Real",
    sliderMessage: "K ovládání displeje použijte posuvník",
    noResults: "Pro váš model stále neexistují žádné výsledky",
    buildFailed:
      "Nejsou k dispozici žádné výsledky predikce, protože stavba modelu selhala.",
    modelPerf: {
      title: "Výkon modelu",
      variance_score: {
        name: "Skóre odchylky"
      },
      max_error_value: {
        name: "Maximální hodnota chyby"
      },
      mean_abs_error_value: {
        name: "Střední hodnota chyby Abs"
      },
      mean_square_error_value: {
        name: "Střední hodnota chyby"
      },
      r2_value: {
        name: "Hodnota R2"
      },
      mse: {
        name: "Střední hodnota chyby"
      },
      mae: {
        name: "Střední hodnota chyby Abs"
      },
      mape: {
        name: "Střední absolutní procentuální chyba"
      }
    }
  },

  deleteModal: {
    deleteModalTitle: "Smazat účet?",
    deleteModalSure: "Opravdu chcete svůj účet smazat?",
    deleteModalInfo: "Tuto akci nelze vrátit zpět!",
    confirmBtn: "Potvrdit",
    cancelBtn: "Zrušení"
  },

  history: {
    title: "Dějiny",
    list: {
      searchHistory: "Historie vyhledávání",
      searchedFor: "Hledali jste "
    }
  },
  breadcrumbs: {
    Dashboard: "Přístrojová deska",
    Analysis: "Analýza",
    Companies: "Společnosti",
    Compare: "Porovnat",
    "Add new model": "Přidat nový model"

    // add here breadcrumbs translations
  },
  articleDetails: {
    relatedArticles: "Související články",
    source: "Zdroj"
  },
  dashboard: {
    chartTitle: "Týdenní ceny",
    articles: "Články",
    prevButton: "Minulý týden",
    nextButton: "Příští týden",
    latestPrices: "Poslední ceny od "
  },
  search: {
    title: "Vyhledávání",
    noResults: "Žádné výsledky...",
    close: "Zavřít"
  },
  notFound: {
    message: "Litujeme, ale nenašli jsme hledanou stránku",
    goBack: "Vraťte se na palubní desku"
  }
};
export default cz;
