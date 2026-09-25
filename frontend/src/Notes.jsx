/**
* ============================================================================
* COMPONENT: GIAO DIỆN QUẢN LÝ GHI CHÚ (Notes.jsx)
* ============================================================================
*/
import React, { useState, useEffect } from 'react';

const NOTES_PER_PAGE = 2;

function Notes() {
    const [topic, setTopic] = useState('hoc-tap');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });

    // Bộ lọc và phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Ghi lại note vừa xóa để useEffect theo dõi và log
    const [deletedNote, setDeletedNote] = useState(null);

    const fetchNotes = () => {
        fetch(`http://localhost:5000/api/notes/${topic}`)
            .then(res => {
                if (!res.ok) throw new Error('Không thể tải danh sách ghi chú');
                return res.json();
            })
            .then(data => setNotes(data))
            .catch(error => console.error(error));
    };

    useEffect(() => {
        fetchNotes();
    }, [topic]);

    // Reset về trang đầu khi đổi chủ đề hoặc thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [topic, searchTerm, sortOrder]);

    // Log sau khi thao tác xóa thành công.
    // Đây là side effect nên được đặt trong useEffect.
    useEffect(() => {
        if (deletedNote) {
            console.log('[DELETE NOTE]', {
                id: deletedNote.id,
                title: deletedNote.title,
                topic: deletedNote.topic,
                deletedAt: new Date().toISOString()
            });
        }
    }, [deletedNote]);

    const handleSave = () => {
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
            : `http://localhost:5000/api/notes/${topic}`;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: formData.title,
                content: formData.content
            })
        })
            .then(res => {
                if (!res.ok) throw new Error('Không thể lưu ghi chú');
                return res.json();
            })
            .then(() => {
                fetchNotes();
                setFormData({ id: null, title: '', content: '' });
            })
            .catch(error => console.error(error));
    };

    const handleDelete = (note) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            fetch(`http://localhost:5000/api/notes/${topic}/${note.id}`, {
                method: 'DELETE'
            })
                .then(res => {
                    if (!res.ok) throw new Error('Không thể xóa ghi chú');
                    return res.json();
                })
                .then(() => {
                    // Lưu thông tin note đã xóa để useEffect ghi log.
                    setDeletedNote({ ...note, topic });
                    fetchNotes();
                })
                .catch(error => console.error(error));
        }
    };

    const handleEdit = (note) => setFormData({
        id: note.id,
        title: note.title,
        content: note.content
    });

    // Tìm kiếm theo từ khóa, sau đó sắp xếp theo ngày tạo
    const filteredNotes = notes.filter(note => {
        const keyword = searchTerm.trim().toLowerCase();
        return !keyword ||
            note.title?.toLowerCase().includes(keyword) ||
            note.content?.toLowerCase().includes(keyword);
    });

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // Phân trang
    const totalPages = Math.max(1, Math.ceil(sortedNotes.length / NOTES_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * NOTES_PER_PAGE;
    const paginatedNotes = sortedNotes.slice(
        startIndex,
        startIndex + NOTES_PER_PAGE
    );

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="h3 fw-bold mb-1">Ghi chú công khai</h2>
                    <p className="text-secondary mb-0">Quản lý, tìm kiếm và sắp xếp các ghi chú của bạn.</p>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <label className="fw-semibold" htmlFor="topicSelect">Chủ đề:</label>
                    <select id="topicSelect" className="form-select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                        <option value="hoc-tap">Học tập</option>
                        <option value="cong-viec">Công việc</option>
                        <option value="ca-nhan">Cá nhân</option>
                    </select>
                </div>
            </div>

            {/* Tìm kiếm + sắp xếp */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-7">
                            <label className="form-label fw-semibold">Tìm kiếm</label>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Tìm theo tiêu đề hoặc nội dung..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Sắp xếp theo ngày</label>
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="desc">Mới nhất </option>
                                <option value="asc">Cũ nhất </option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSortOrder('desc');
                                }}
                                disabled={!searchTerm && sortOrder === 'desc'}
                            >
                                Đặt lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form nhập liệu */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h3 className="h5 mb-0">{formData.id ? 'Sửa ghi chú' : 'Thêm ghi chú mới'}</h3>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Tiêu đề</label>
                        <input
                            className="form-control"
                            placeholder="Nhập tiêu đề"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Nội dung</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Nhập nội dung"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>
                    <button className="btn btn-primary me-2" onClick={handleSave}>
                        {formData.id ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                    {formData.id && (
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setFormData({ id: null, title: '', content: '' })}
                        >
                            Hủy
                        </button>
                    )}
                </div>
            </div>

            {/* Kết quả */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-secondary">Hiển thị {paginatedNotes.length} / {sortedNotes.length} ghi chú</span>
                <span className="badge text-bg-light">Trang {safeCurrentPage} / {totalPages}</span>
            </div>

            {/* Danh sách thẻ ghi chú */}
            <div className="row g-4">
                {paginatedNotes.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-light border text-center mb-0">
                            {notes.length === 0
                                ? 'Chưa có ghi chú nào.'
                                : 'Không tìm thấy ghi chú phù hợp.'}
                        </div>
                    </div>
                )}

                {paginatedNotes.map(note => (
                    <div className="col-md-6" key={note.id}>
                        <div className="card h-100 shadow-sm border border">
                            <div className="card-body d-flex flex-column">
                                <h4 className="card-title h5">{note.title}</h4>
                                <p className="card-text text-secondary flex-grow-1" style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>

                                {note.createdAt && (
                                    <small className="text-secondary d-block mb-3">
                                        Ngày tạo: {new Date(note.createdAt).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </small>
                                )}

                                <div>
                                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(note)}>
                                        Sửa
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(note)}>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
                <nav className="mt-4" aria-label="Phân trang ghi chú">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${safeCurrentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => goToPage(safeCurrentPage - 1)} disabled={safeCurrentPage === 1}>← Trước</button>
                        </li>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                            <li className={`page-item ${safeCurrentPage === page ? 'active' : ''}`} key={page}>
                                <button className="page-link" onClick={() => goToPage(page)}>{page}</button>
                            </li>
                        ))}

                        <li className={`page-item ${safeCurrentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => goToPage(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages}>Sau →</button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}

export default Notes;
