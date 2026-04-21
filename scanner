const Scanner = {
  active: false,
  stream: null,
  animFrame: null,

  async start(onDetected) {
    if (this.active) return;
    this.active = true;

    const overlay = document.createElement('div');
    overlay.id = 'scanner-container';
    overlay.innerHTML = `
      <video id="scanner-video" autoplay playsinline muted></video>
      <div class="scanner-overlay">
        <div class="scanner-frame"></div>
        <p class="scanner-hint">Centrez le code-barres dans le cadre</p>
      </div>
      <button class="scanner-close" onclick="Scanner.stop()">✕</button>
    `;
    document.body.appendChild(overlay);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      const video = document.getElementById('scanner-video');
      video.srcObject = this.stream;
      await video.play();

      if ('BarcodeDetector' in window) {
        this.detectWithAPI(video, onDetected);
      } else {
        this.detectWithZXing(video, onDetected);
      }
    } catch (e) {
      this.stop();
      showToast('⚠️ Accès caméra refusé');
    }
  },

  async detectWithAPI(video, onDetected) {
    const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });

    const scan = async () => {
      if (!this.active) return;
      try {
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          this.stop();
          onDetected(barcodes[0].rawValue);
          return;
        }
      } catch (_) {}
      this.animFrame = requestAnimationFrame(scan);
    };

    this.animFrame = requestAnimationFrame(scan);
  },

  async detectWithZXing(video, onDetected) {
    // Fallback canvas-based detection for older Safari
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scan = () => {
      if (!this.active) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        // Simple fallback: prompt manual entry if BarcodeDetector unavailable
        this.stop();
        const code = prompt('Scanner non supporté sur ce navigateur.\nEntrez le code-barres manuellement :');
        if (code) onDetected(code);
        return;
      }
      this.animFrame = requestAnimationFrame(scan);
    };

    this.animFrame = requestAnimationFrame(scan);
  },

  stop() {
    this.active = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    const el = document.getElementById('scanner-container');
    if (el) el.remove();
  }
};

async function lookupBarcode(barcode) {
  try {
    const res = await fetch(`[world.openfoodfacts.org](https://world.openfoodfacts.org/api/v0/product/${barcode}.json)`);
    const data = await res.json();
    if (data.status === 1) {
      const p = data.product;
      return {
        name: p.product_name_fr || p.product_name || 'Produit inconnu',
        barcode
      };
    }
  } catch (_) {}
  return { name: '', barcode };
}
