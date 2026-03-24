import httpClient from "@/api/httpClient";

export function initMainPage() {
  const title = document.getElementById("mainBannerTitle");
  const desc = document.getElementById("mainBannerDesc");
  const popularList = document.getElementById("popularPartyList");
  const loading = document.getElementById("popularLoading");

  Promise.all([
    httpClient.get("/main/banner"),
    httpClient.get("/main/popular-parties"),
  ])
    .then(([bannerRes, partyRes]) => {
      if (bannerRes.success && bannerRes.data) {
        title.innerText = bannerRes.data.title;
        desc.innerText = bannerRes.data.description;
      }

      if (partyRes.success && partyRes.data) {
        loading.classList.add("hidden");

        const list = partyRes.data;

        popularList.innerHTML = list
          .map(
            (p) => `
            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition" 
                 role="link" data-href="/party/${p.id}">
              <h3 class="font-bold">${p.title}</h3>
              <p class="text-sm text-gray-500 mt-1">${p.description}</p>
              <p class="mt-3 font-semibold">₩${p.price}</p>
            </div>
          `
          )
          .join("");
      }
    })
    .catch(() => {
      loading.innerText = "데이터 불러오기 실패";
    });
}
