function getDocumentRegistry() {
  const raw =
    PropertiesService
      .getScriptProperties()
      .getProperty("DOCUMENT_REGISTRY");

  if (!raw) {
    throw new Error(
      "DOCUMENT_REGISTRY is missing. Run engineHealthCheck() first."
    );
  }

  return JSON.parse(raw);
}


function getKnowledgeDocument(documentName) {
  const registry =
    getDocumentRegistry();

  const documentId =
    registry[documentName];

  if (!documentId) {
    throw new Error(
      'Document not registered: "' +
      documentName +
      '"'
    );
  }

  return DocumentApp.openById(
    documentId
  );
}


function appendToKnowledgeDocument(
  documentName,
  content
) {
  const doc =
    getKnowledgeDocument(
      documentName
    );

  const body =
    doc.getBody();

  body.appendParagraph("");

  body.appendParagraph(
    content
  );

  doc.saveAndClose();

  return doc.getId();
}


function appendStructuredEntry(
  documentName,
  title,
  sections
) {
  const doc =
    getKnowledgeDocument(
      documentName
    );

  const body =
    doc.getBody();

  body.appendParagraph("");

  body.appendParagraph(title)
    .setHeading(
      DocumentApp.ParagraphHeading.HEADING1
    );

  for (const section of sections) {

    body.appendParagraph(
      section.heading
    ).setHeading(
      DocumentApp.ParagraphHeading.HEADING2
    );

    body.appendParagraph(
      section.content
    );
  }

  doc.saveAndClose();

  return doc.getId();
}