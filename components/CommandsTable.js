'use client'

export default function CommandsTable({ commands }) {
  if (commands.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron comandos.</p>
      </div>
    )
  }

  return (
    <div className="commands-table">
      <table>
        <thead>
          <tr>
            <th>Comando</th>
            <th>Descripción</th>
            <th>Ejemplo</th>
            <th>Nivel</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((cmd, idx) => (
            <tr key={idx}>
              <td className="cmd-name"><code>{cmd.cmd}</code></td>
              <td>{cmd.desc}</td>
              <td className="cmd-example"><code>{cmd.example}</code></td>
              <td><span className={`nivel-badge nivel-${cmd.level}`}>{cmd.level}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
