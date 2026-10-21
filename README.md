# NIHONGO SPEED MASTER - JPD326 (日本語速習マスター)

Hệ thống phần mềm học và ôn tập cấp tốc toàn diện môn **JPD326 (Tiếng Nhật Trung cấp - できる日本語中級)** dành cho sinh viên, tự động trích xuất và số hóa 100% dữ liệu từ các tài liệu và slide có sẵn.

---

## 🌟 Tổng Quan Dữ Liệu Đã Được Tích Hợp

| Hạng mục | Số lượng | Chi tiết nội dung |
| :--- | :---: | :--- |
| **Từ vựng (語彙)** | **531 từ** | Phân loại từ Bài 6 đến Bài 10 (Part 1 → Part 5, 知って楽しむ), có Kanji, Furigana và nghĩa tiếng Việt |
| **Hán tự (漢字)** | **73 Kanji** | Toàn bộ Hán tự trọng tâm Bài 6 → 10, đầy đủ âm Hán-Việt, âm On, âm Kun và các từ ghép ví dụ thực tế |
| **Ngữ pháp (文法)** | **69 Mẫu câu** | Bài 6 → 10: Tên cấu trúc, Công thức chuẩn, Điểm lưu ý (ポイント), Câu ví dụ thực tế |
| **Slide Bài giảng** | **337 Slide** | Trích xuất từ 4 slide PPTX (Bài 6: 67 slide, Bài 7: 61 slide, Bài 8: 56 slide, Bài 9: 153 slide) kèm toàn bộ tranh ảnh minh họa gốc |

---

## ⚡ Các Tính Năng & Chế Độ Học Cấp Tốc

### 1. 🗂️ Thẻ Nhớ 3D Lặp Lại Ngắt Quãng (SRS Flashcards)
- **Lật thẻ 3D mượt mà**: Mặt trước hiển thị Chữ Hán / Cách đọc, mặt sau hiển thị Âm Hán-Việt, Nghĩa tiếng Việt và Ví dụ.
- **Thuật toán Spaced Repetition (SRS)**: 4 mức đánh giá `[1] Chưa thuộc`, `[2] Khó nhớ`, `[3] Đã nhớ`, `[4] Quá dễ` tự động phân loại và tối ưu thời gian ôn lại.
- **Chế độ rảnh tay (Hands-Free Auto-Play)**: Tự động chạy thẻ, phát âm tiếng Nhật, lật mặt sau và chuyển tiếp sang thẻ mới mà không cần chạm tay.
- **Phát âm tiếng Nhật chuẩn bản xứ**: Tích hợp trực tiếp Web Speech API (`ja-JP`).

### 2. ⚡ Speed Quiz Arena (Đấu Trường Tốc Độ)
- **5 Chế độ thử thách**:
  1. `Từ vựng (JP → VN)`: Nhìn chữ Nhật, đoán nghĩa tiếng Việt.
  2. `Từ vựng (VN → JP)`: Nhìn nghĩa tiếng Việt, chọn từ tiếng Nhật.
  3. `Hán tự (Kanji → Hán-Việt)`: Đoán âm Hán-Việt và cách đọc.
  4. `Ngữ pháp mẫu câu`: Chọn công thức đúng cho mẫu ngữ pháp.
  5. `Thử thách hỗn hợp`: Kết hợp ngẫu nhiên toàn bộ kiến thức.
- **Đồng hồ đếm ngược 10 giây**: Rèn luyện khả năng phản xạ và xử lý tức thì trong phòng thi.
- **Hệ thống Combo & Âm thanh**: Hiệu ứng âm thanh sinh động (đúng/sai/fanfare hoàn thành) và nhân điểm theo chuỗi combo liên tiếp.

### 3. 🖥️ Bộ Duyệt & Học 337 Slide Chuyên Nghiệp
- Trích xuất 100% hình ảnh minh họa, sơ đồ, bảng biểu từ 4 file PowerPoint gốc.
- Định dạng văn bản phân đoạn sạch sẽ, dễ đọc.
- Thanh cuộn Thumbnail trực quan giúp chuyển nhanh đến bất kỳ slide nào.
- Tính năng đọc to toàn bộ nội dung slide bằng tiếng Nhật.
- Tìm kiếm tức thì từ khóa trong cả 337 slide.

### 4. 🔍 Omnisearch Tức Thì (`Ctrl + K`)
- Tìm kiếm thống nhất trên toàn bộ 531 từ vựng, 73 Hán tự, 69 cấu trúc ngữ pháp và 337 slide chỉ với 1 phím bấm.

---

## ⌨️ Bảng Phím Tắt Tốc Độ Cao

| Phím tắt | Thao tác |
| :--- | :--- |
| **`Space`** | Lật mặt trước / mặt sau của Thẻ nhớ |
| **`1`, `2`, `3`, `4`** | Đánh giá mức độ nhớ của thẻ SRS (Chưa thuộc / Khó / Đã nhớ / Quá dễ) |
| **`1`, `2`, `3`, `4`** | Chọn nhanh đáp án tương ứng trong Speed Quiz |
| **`←` / `→`** | Chuyển thẻ trước / tiếp theo trong Flashcard hoặc chuyển trang trong Slide |
| **`P`** | Phát âm lại từ tiếng Nhật hiện tại |
| **`Ctrl + K`** | Mở thanh tra cứu nhanh Omnisearch |
| **`Esc`** | Đóng cửa sổ tra cứu / Chi tiết Hán tự |

---

## 🚀 Hướng Dẫn Khởi Chạy

### Cách 1: Chạy bằng file `.bat` (Khuyên dùng)
- **Bắt đầu học**: Nhấp đúp chuột vào file **`start_app.bat`** tại thư mục gốc. Trình duyệt sẽ tự động mở trang web học tập tại địa chỉ: `http://localhost:3000`.
- **Dừng khi học xong**: Nhấp đúp chuột vào file **`stop_app.bat`** tại thư mục gốc để tắt máy chủ localhost 3000 hoàn toàn.

### Cách 2: Mở trực tiếp trong trình duyệt
- Mở thư mục `web_app/` và nhấp đúp vào **`index.html`** để học ngay mà không cần cài đặt thêm bất kỳ phần mềm nào.
