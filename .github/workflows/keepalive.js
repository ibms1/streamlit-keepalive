const { chromium } = require("playwright");

const apps = [
  {
    name: "bgrm",
    url: "https://sbuqwhqmbgnwcbzebapxmg.streamlit.app/?embed=true",
  },
  {
    name: "easy-ranking-keywords",
    url: "https://easy-ranking-keywords-8mvdnrvziygkxteghtuhba.streamlit.app/?embed=true",
  },
  {
    name: "emorec",
    url: "https://emorec-f2rghqhdu6gwcqkhwziz7p.streamlit.app/?embed=true",
  },
  {
    name: "etexmg",
    url: "https://etexmg-vmmmqihvwtjvihtfqf2fmv.streamlit.app/?embed=true",
  },
  {
    name: "imgeft",
    url: "https://imgeft-ndd69xcmiwedzq8uy3hwbo.streamlit.app/?embed=true",
  },
  {
    name: "imgtun",
    url: "https://imgtun-8rbwasbkjahgxbgv2b6qv8.streamlit.app/?embed=true",
  },
  {
    name: "infueff",
    url: "https://infueff-dratjwpd4ub8pnyfkwkxru.streamlit.app/?embed=true",
  },
  {
    name: "scrigen",
    url: "https://scrigen-mzt8245yut2yqtggfhwfhp.streamlit.app/?embed=true",
  },
  {
    name: "sudeft",
    url: "https://sudeft-vjns4b9ubhcmauuazmd2cc.streamlit.app/?embed=true",
  },
  {
    name: "videdit",
    url: "https://videdit-m8hcmbpaakaf6bwqrhmlbb.streamlit.app/?embed=true",
  },
  {
    name: "voicover",
    url: "https://voicover-5zw62ztswjxeyuc8rvnciq.streamlit.app/?embed=true",
  },
  {
    name: "ytsugnam",
    url: "https://ytsugnam-5xej4g7nj7katgfxegvbc4.streamlit.app/?embed=true",
  },
];

async function visitApp(browser, app) {
  const context = await browser.newContext({
    viewport: {
      width: 1366,
      height: 768,
    },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/140.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  try {
    console.log("\n======================================");
    console.log(`Opening: ${app.name}`);
    console.log(`URL: ${app.url}`);

    await page.goto(app.url, {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });

    console.log(`Initial URL: ${page.url()}`);

    // إعطاء Streamlit وقتًا لتحميل الواجهة
    await page.waitForTimeout(15000);

    // فحص ما إذا كان التطبيق في وضع السبات
    const wakeButton = page.getByRole("button", {
      name: /Yes, get this app back up!/i,
    });

    if (await wakeButton.count()) {
      console.log(`${app.name}: App is sleeping.`);

      try {
        await wakeButton.first().click();
        console.log(`${app.name}: Wake button clicked.`);

        // انتظر استيقاظ التطبيق
        await page.waitForTimeout(30000);
      } catch (e) {
        console.log(`${app.name}: Could not click wake button.`);
      }
    } else {
      console.log(`${app.name}: App appears to be awake.`);
    }

    // انتظر حتى تبدأ واجهة Streamlit بالعمل
    await page.waitForTimeout(10000);

    console.log(`${app.name}: Final URL = ${page.url()}`);
    console.log(`${app.name}: Title = ${await page.title()}`);

  } catch (error) {
    console.error(`❌ ${app.name}: FAILED`);
    console.error(error.message);
  } finally {
    await context.close();
  }
}

(async () => {
  console.log("======================================");
  console.log("Streamlit Keepalive Started");
  console.log(`Total apps: ${apps.length}`);
  console.log("======================================");

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    // فتح التطبيقات واحدًا تلو الآخر
    for (const app of apps) {
      await visitApp(browser, app);

      // تأخير 3 ثوانٍ بين كل تطبيق
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  } finally {
    await browser.close();
  }

  console.log("\n======================================");
  console.log("✅ All Streamlit apps processed.");
  console.log("======================================");
})();
