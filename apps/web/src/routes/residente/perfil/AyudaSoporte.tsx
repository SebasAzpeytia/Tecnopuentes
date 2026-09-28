import { useNavigate } from 'react-router-dom';

export default function AyudaSoporte() {
  const navigate = useNavigate();

  const faqs = [
    { label: 'Cómo jugar Memorama', icon: 'fa-solid fa-brain', color: 'var(--color-blue)' },
    { label: 'Cómo jugar Solitario', icon: 'fa-solid fa-clone', color: 'var(--color-olive)' },
    { label: 'Cómo usar el chat', icon: 'fa-solid fa-comment-dots', color: 'var(--color-orange-dark)' },
    { label: 'Olvidé mi contraseña', icon: 'fa-solid fa-key', color: 'var(--color-blue-light)' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '24px', fontFamily: 'var(--font-body)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-blue)', backgroundColor: 'transparent', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={{ fontSize: '20px', color: 'var(--color-text)', margin: 0, fontFamily: 'var(--font-title)' }}>
          Ayuda y soporte
        </h1>
      </div>

      <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '24px' }}>
        ¿En qué te podemos ayudar?
      </p>

      {/* Lista de FAQs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {faqs.map((faq, idx) => (
          <button
            key={idx}
            style={{
              backgroundColor: 'var(--color-white)',
              border: 'none',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: faq.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-white)',
                  fontSize: '16px',
                }}
              >
                <i className={faq.icon}></i>
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                {faq.label}
              </span>
            </div>
            <i className="fa-solid fa-chevron-right" style={{ color: 'var(--color-gray)', fontSize: '14px' }}></i>
          </button>
        ))}
      </div>

      {/* Tip Box & Button */}
      <div style={{ marginTop: '24px' }}>
        <div style={{ backgroundColor: '#f5eadb', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>🙋‍♀️</span>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text)', fontWeight: 600, lineHeight: '1.4' }}>
            ¿Sigues con dudas? Tu cuidador puede ayudarte en persona.
          </p>
        </div>
        
        <button style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-orange-dark)', color: 'var(--color-white)', border: 'none', borderRadius: '999px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(244, 92, 25, 0.3)' }}>
          Pedir ayuda a mi cuidador
        </button>
      </div>

    </div>
  );
}
