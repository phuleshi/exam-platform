import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { userApi } from '../../services/userApi';
import { KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải chứa ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu mới không khớp!');
      return;
    }

    setLoading(true);

    try {
      const res = await userApi.changePassword({ oldPassword, newPassword });
      if (res.success) {
        setSuccess('Đổi mật khẩu thành công!');
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      setError(err || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Đổi Mật Khẩu Tài Khoản">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <Input
          label="Mật khẩu hiện tại"
          type="password"
          placeholder="••••••••"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <Input
          label="Mật khẩu mới"
          type="password"
          placeholder="Nhập ít nhất 6 ký tự"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Input
          label="Xác nhận mật khẩu mới"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Hủy bỏ
          </Button>
          <Button type="submit" isLoading={loading}>
            <KeyRound size={16} />
            <span>Cập Nhật Mật Khẩu</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
