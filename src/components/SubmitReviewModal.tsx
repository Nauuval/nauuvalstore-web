'use client';

import React, { useState, useRef } from 'react';
import { X, Star, Upload, Image as ImageIcon, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { ProductCategory, TransactionProof } from '@/types';
import { compressImageFile } from '@/lib/image-utils';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (proof: Partial<TransactionProof>) => Promise<boolean>;
}

const CATEGORIES: ProductCategory[] = [
  'JOKI FISCH',
  'JOKI BLOX FRUIT',
  'KEBUTUHAN FISCH',
  'KEBUTUHAN BLOX FRUIT',
];

export default function SubmitReviewModal({
  isOpen,
  onClose,
  onSubmit,
}: SubmitReviewModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('JOKI FISCH');
  const [amount, setAmount] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [maskName, setMaskName] = useState(true);

  // File upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setIsProcessingImage(true);

    try {
      const compressed = await compressImageFile(file);
      setImagePreview(compressed);
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || 'Gagal memproses gambar. Coba file lain.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !serviceName.trim()) {
      alert('Mohon isi nama dan layanan yang dipesan.');
      return;
    }

    if (!imagePreview) {
      alert('Mohon upload bukti screenshot pembayaran atau layanan.');
      return;
    }

    setIsSubmitting(true);

    // Format masked buyer name if checked
    let finalBuyerName = buyerName.trim();
    if (maskName && finalBuyerName.length > 2) {
      const firstPart = finalBuyerName.substring(0, 3);
      const lastPart = finalBuyerName.length > 5 ? finalBuyerName.slice(-2) : '';
      finalBuyerName = `${firstPart}***${lastPart}`;
    }

    const payload: Partial<TransactionProof> = {
      buyer_name: finalBuyerName,
      service_name: serviceName.trim(),
      category,
      amount: amount ? parseFloat(amount) : 0,
      date: 'Hari ini',
      rating,
      notes: notes.trim(),
      image_url: imagePreview,
    };

    const ok = await onSubmit(payload);
    setIsSubmitting(false);

    if (ok) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        handleReset();
        onClose();
      }, 2000);
    }
  };

  const handleReset = () => {
    setBuyerName('');
    setServiceName('');
    setCategory('JOKI FISCH');
    setAmount('');
    setRating(5);
    setNotes('');
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl metallic-card p-6 sm:p-7 shadow-2xl my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ccff00] text-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ccff00]/30 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase font-mono">
              Terima Kasih!
            </h3>
            <p className="mt-2 text-xs text-zinc-300">
              Testimoni dan bukti transaksi Anda telah berhasil dikirim dan tampil di website.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-700 text-[#ccff00] text-[10px] font-mono font-bold mb-1.5 uppercase">
                <Star className="w-3 h-3 fill-[#ccff00]" />
                <span>Ulasan Pelanggan nauuvalstore</span>
              </div>
              <h3 className="text-lg font-black text-white uppercase font-mono tracking-tight">
                Tulis Rating & Upload Bukti Transaksi
              </h3>
              <p className="text-xs text-zinc-400">
                Bagikan pengalaman joki/belanja Anda untuk membantu calon pembeli lainnya.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Rating Bintang Interaktif */}
              <div className="p-3.5 rounded-xl bg-black/70 border border-zinc-800 text-center">
                <label className="block text-xs font-bold text-zinc-300 mb-2 uppercase font-mono">
                  Beri Rating Layanan:
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#ccff00] text-[#ccff00]'
                            : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-[#ccff00] ml-2">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              {/* Nama & Samarkan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-zinc-300 uppercase">
                    Nama / Username Roblox:
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-400">
                    <input
                      type="checkbox"
                      checked={maskName}
                      onChange={(e) => setMaskName(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-[#ccff00] focus:ring-0"
                    />
                    <span>Samarkan Nama (Contoh: Dan***99)</span>
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Contoh: Danu_Player atau ProGamer99"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#ccff00] font-semibold"
                />
              </div>

              {/* Kategori & Layanan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">
                    Kategori:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#ccff00] font-semibold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">
                    Nominal Transaksi (Rp, Opsional):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 65000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Layanan yang Dipesan:
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Contoh: Joki Quest Rod of the Depths / Fruit Kitsune"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              {/* Testimoni Textarea */}
              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Ulasan / Testimoni Anda:
                </label>
                <textarea
                  rows={2}
                  required
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tulis kepuasan pengerjaan joki, kecepatan layanan, atau keramahan admin..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              {/* Upload Screenshot Bukti Transaksi Langsung dari HP / Laptop */}
              <div>
                <label className="block font-bold text-zinc-300 mb-1.5 uppercase flex items-center justify-between">
                  <span>Upload Bukti Screenshot (Dari Perangkat):</span>
                  <span className="text-[10px] text-zinc-500 font-normal">PNG / JPG / WEBP</span>
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl border border-zinc-700 bg-black p-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-700">
                        <img
                          src={imagePreview}
                          alt="Preview Screenshot"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="font-bold text-white text-xs truncate">
                          Bukti Berhasil Dipilih ✓
                        </p>
                        <p className="text-[10px] text-[#ccff00] font-mono">
                          Siap diunggah ke website
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 text-xs font-semibold border border-zinc-800 transition-colors"
                    >
                      Ganti Foto
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="customer-proof-file"
                    />
                    <label
                      htmlFor="customer-proof-file"
                      className="w-full py-5 px-4 rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#ccff00] bg-black/60 hover:bg-zinc-900/40 text-center flex flex-col items-center justify-center cursor-pointer transition-all group"
                    >
                      {isProcessingImage ? (
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Loader2 className="w-5 h-5 animate-spin text-[#ccff00]" />
                          <span className="font-semibold text-xs">Memproses Gambar...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:text-[#ccff00] group-hover:border-[#ccff00] transition-colors mb-2">
                            <Upload className="w-5 h-5" />
                          </div>
                          <p className="font-bold text-white text-xs">
                            Pilih Foto / Screenshot Dari HP atau Komputer Anda
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Klik di sini untuk membuka galeri foto perangkat
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                {imageError && (
                  <p className="text-rose-400 text-[11px] mt-1 font-semibold">
                    {imageError}
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-zinc-900 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isProcessingImage}
                  className="px-5 py-2.5 rounded-xl bg-[#ccff00] text-black hover:bg-[#bbf000] font-black text-xs shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Kirim Testimoni & Bukti</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
