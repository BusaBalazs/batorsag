function Diamond() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.6em] size-1.5 shrink-0 rotate-45 bg-gold"
    />
  );
}

function Line({ item }) {
  return (
    <p>
      {item.label && (
        <strong className="font-semibold text-gold-light">{item.label}</strong>
      )}
      {item.label && item.text ? " " : ""}
      {item.text}
    </p>
  );
}

/** Egy pont: félkövér címke + szöveg, opcionális alpontokkal. */
export default function Items({ items }) {
  return (
    <ul className="space-y-4 text-[1.02rem] leading-relaxed text-parchment/90">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <Diamond />
          <div className="min-w-0 flex-1">
            <Line item={item} />
            {item.children && (
              <ul className="mt-3 space-y-3 border-l border-gold/25 pl-4">
                {item.children.map((child, j) => (
                  <li key={j}>
                    <Line item={child} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
