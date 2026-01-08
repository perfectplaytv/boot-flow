import { useState } from "react";
// Supabase removido
// const PLAN_TABLES = ... (não usado mais para insert direto)

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    plano: "Essencial",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      // 1. Criar usuário via API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: "Password123!", // Senha temporária
          name: form.nome,
          role: 'client'
        }),
      });

      if (!response.ok) {
        console.warn("Usuário talvez já exista ou erro na API");
      }

      // 2. Enviar e-mail (exemplo)
      await fetch("/api/send-cadastro-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cadastro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nome</label>
          <input
            type="text"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
            title="Digite seu nome"
            placeholder="Nome completo"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
            title="Digite seu e-mail"
            placeholder="E-mail"
          />
        </div>
        <div>
          <label className="block mb-1">WhatsApp</label>
          <input
            type="text"
            value={form.whatsapp}
            onChange={e => setForm({ ...form, whatsapp: e.target.value })}
            required
            className="w-full border px-3 py-2 rounded"
            title="Digite seu WhatsApp"
            placeholder="WhatsApp com DDD"
          />
        </div>
        <div>
          <label className="block mb-1">Plano</label>
          <select
            value={form.plano}
            onChange={e => setForm({ ...form, plano: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            title="Selecione o plano"
          >
            <option>Essencial</option>
            <option>Profissional</option>
            <option>Business</option>
            <option>Elite</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
        >
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        {success && <div className="text-green-600 mt-2">Cadastro realizado com sucesso!</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}
