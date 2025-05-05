import React, { useState, useEffect } from 'react';
import { Button, Card, Divider, Input, message, Steps, Typography } from 'antd';
import { QrcodeOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons';
import Image from 'next/image';

// Antd React 19 uyarısını bastırmak için
const originalConsoleError = console.error;
console.error = function filterWarnings(msg, ...args) {
  if (typeof msg === 'string' && msg.includes('Warning: [antd: compatible] antd v5 support React is 16 ~ 18')) {
    return;
  }
  return originalConsoleError(msg, ...args);
};

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface BackupCodesProps {
  codes: string[];
}

// Yedek kodları gösteren bileşen
const BackupCodes = ({ codes }: BackupCodesProps) => (
  <div className="p-4 border rounded-md bg-gray-50 mt-4">
    <Text strong>Yedek Kodlar (Güvenli bir yerde saklayın):</Text>
    <div className="grid grid-cols-2 gap-2 mt-2">
      {codes.map((code, index) => (
        <Text key={index} code className="text-sm">{code}</Text>
      ))}
    </div>
    <Text className="mt-4 text-sm text-gray-500 block">
      Not: Bu kodlar, kimlik doğrulayıcı uygulamanıza erişiminizi kaybettiğinizde kullanılabilir.
      Her kod yalnızca bir kez kullanılabilir.
    </Text>
  </div>
);

interface TwoFactorAuthProps {
  isEnabled: boolean;
  userId: string;
  onUpdate: () => void;
}

export default function TwoFactorAuth({ isEnabled, userId, onUpdate }: TwoFactorAuthProps) {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState<{ qrCode?: string; secret?: string; backupCodes?: string[] }>({});
  const [verificationCode, setVerificationCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [disabling, setDisabling] = useState(false);

  // 2FA kurulum verilerini getir
  const fetchSetupData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/two-factor/setup');
      
      if (!response.ok) {
        throw new Error('Kurulum verileri alınamadı');
      }
      
      const data = await response.json();
      setSetupData(data);
      setCurrent(1); // QR kod adımına ilerle
    } catch (error) {
      message.error('İki faktörlü kimlik doğrulama kurulumu sırasında bir hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Doğrulama kodunu kontrol et ve 2FA'yı etkinleştir
  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      message.error('Lütfen geçerli bir 6 haneli doğrulama kodu girin');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/two-factor/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verificationCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Doğrulama başarısız');
      }

      message.success('İki faktörlü kimlik doğrulama başarıyla etkinleştirildi');
      setCurrent(2); // Tamamlandı adımına ilerle
      onUpdate(); // Üst bileşeni güncelle
    } catch (error) {
      message.error('Doğrulama kodu geçersiz veya süresi dolmuş');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2FA'yı devre dışı bırak
  const disableTwoFactor = async () => {
    if (!disableCode || disableCode.length !== 6) {
      message.error('Lütfen geçerli bir 6 haneli doğrulama kodu girin');
      return;
    }

    try {
      setDisabling(true);
      const response = await fetch('/api/auth/two-factor/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: disableCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Devre dışı bırakma başarısız');
      }

      message.success('İki faktörlü kimlik doğrulama başarıyla devre dışı bırakıldı');
      onUpdate(); // Üst bileşeni güncelle
      setDisableCode('');
    } catch (error) {
      message.error('Doğrulama kodu geçersiz veya süresi dolmuş');
      console.error(error);
    } finally {
      setDisabling(false);
    }
  };

  // 2FA kurulum adımları
  const steps = [
    {
      title: 'Başlat',
      content: (
        <div className="my-4 text-center">
          <SecurityScanOutlined className="text-5xl text-blue-500 mb-4" />
          <Title level={4}>İki Faktörlü Kimlik Doğrulama</Title>
          <Paragraph>
            İki faktörlü kimlik doğrulama, hesabınızı ekstra bir güvenlik katmanıyla korur.
            Giriş yaparken şifrenize ek olarak, kimlik doğrulayıcı uygulamanızdan alacağınız 
            kodu da girmeniz gerekecektir.
          </Paragraph>
          <Button 
            type="primary" 
            onClick={fetchSetupData} 
            loading={loading}
          >
            Kuruluma Başla
          </Button>
        </div>
      ),
    },
    {
      title: 'QR Kodu Tara',
      content: (
        <div className="my-4">
          <Title level={4}>QR Kodu Tara</Title>
          <Paragraph>
            QR kodunu Google Authenticator, Microsoft Authenticator veya başka bir kimlik 
            doğrulayıcı uygulamayla tarayın.
          </Paragraph>
          
          {setupData.qrCode && (
            <div className="text-center my-4">
              <div className="inline-block p-4 bg-white border">
                <img src={setupData.qrCode} alt="QR Code" width={200} height={200} />
              </div>
              
              {setupData.secret && (
                <div className="mt-4">
                  <Text strong>Manuel giriş için kod: </Text>
                  <Text code copyable>{setupData.secret}</Text>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4">
            <Input.Search
              placeholder="6 haneli doğrulama kodu"
              maxLength={6}
              value={verificationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
              enterButton="Doğrula"
              loading={loading}
              onSearch={verifyAndEnable}
            />
          </div>
          
          {setupData.backupCodes && (
            <BackupCodes codes={setupData.backupCodes} />
          )}
        </div>
      ),
    },
    {
      title: 'Tamamlandı',
      content: (
        <div className="my-4 text-center">
          <LockOutlined className="text-5xl text-green-500 mb-4" />
          <Title level={4}>İki Faktörlü Kimlik Doğrulama Etkinleştirildi</Title>
          <Paragraph>
            Hesabınız artık iki faktörlü kimlik doğrulama ile korunuyor.
            Giriş yaparken, şifrenize ek olarak kimlik doğrulayıcı uygulamanızdan 
            alacağınız 6 haneli kodu da girmeniz gerekecektir.
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <Title level={3} className="mb-4">İki Faktörlü Kimlik Doğrulama</Title>
      
      {isEnabled ? (
        <div>
          <div className="mb-4 flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <Text strong>İki faktörlü kimlik doğrulama etkin</Text>
          </div>
          
          <Divider />
          
          <div className="mt-4">
            <Title level={5}>İki Faktörlü Kimlik Doğrulamayı Devre Dışı Bırak</Title>
            <Paragraph className="text-red-600">
              İki faktörlü kimlik doğrulamayı devre dışı bırakmak hesabınızın güvenliğini azaltacaktır.
            </Paragraph>
            
            <div className="flex items-center mt-4">
              <Input 
                placeholder="6 haneli doğrulama kodu" 
                value={disableCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisableCode(e.target.value)}
                maxLength={6}
                className="max-w-xs mr-2"
              />
              <Button 
                danger 
                loading={disabling} 
                onClick={disableTwoFactor}
              >
                Devre Dışı Bırak
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Steps current={current} className="mb-8">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          
          <div>{steps[current].content}</div>
        </div>
      )}
    </Card>
  );
} 