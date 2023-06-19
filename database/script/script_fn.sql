CREATE OR REPLACE FUNCTION fn_documento_numero(_codigo_tipo_documento varchar, _year varchar)
  RETURNS varchar
  LANGUAGE plpgsql AS
$func$
BEGIN
  return(
    select concat(_codigo_tipo_documento,'-',_year,'-',TO_CHAR((coalesce(max(replace(doc.numero_documento,concat(_codigo_tipo_documento,'-',_year,'-'),'')),'0')::int)+1,'fm00000'))
    from documento as doc
    inner join tipo_documento as tipo_doc on doc.id_tipo_documento=tipo_doc.id    
    where tipo_doc.codigo=_codigo_tipo_documento and extract(year from fecha_documento::timestamp with time zone at time zone 'America/Lima')=_year::int
  );
   --RETURN _codigo_tipo_documento;
-- Or:
-- RETURN (SELECT col1 FROM tbl WHERE id = _param_id);
END
$func$;
