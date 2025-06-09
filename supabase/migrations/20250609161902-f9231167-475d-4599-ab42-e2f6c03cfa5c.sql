
-- Insert a test client portal access record
INSERT INTO client_portal_access (
  event_id,
  access_code,
  client_name,
  client_email,
  expires_at,
  is_active
) VALUES (
  'test-event-123',
  'DEMO2024',
  'John & Sarah Wedding',
  'john.sarah@example.com',
  '2025-12-31 23:59:59+00',
  true
);

-- Insert some test deliverables for the event
INSERT INTO client_deliverables (
  event_id,
  file_name,
  file_url,
  file_type,
  file_size,
  is_approved,
  is_watermarked,
  download_count
) VALUES 
(
  'test-event-123',
  'Wedding_Photos_Preview.jpg',
  'https://picsum.photos/800/600',
  'image/jpeg',
  2048000,
  true,
  true,
  0
),
(
  'test-event-123',
  'Ceremony_Highlights.mp4',
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'video/mp4',
  15728640,
  true,
  false,
  3
),
(
  'test-event-123',
  'Reception_Gallery.zip',
  'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-zip-file.zip',
  'application/zip',
  52428800,
  true,
  false,
  1
);

-- Insert some test feedback
INSERT INTO client_feedback (
  event_id,
  deliverable_id,
  feedback_text,
  status
) VALUES 
(
  'test-event-123',
  (SELECT id FROM client_deliverables WHERE file_name = 'Wedding_Photos_Preview.jpg' LIMIT 1),
  'These photos are absolutely beautiful! We love them.',
  'approved'
),
(
  'test-event-123',
  NULL,
  'Thank you for the amazing work. The whole experience was wonderful!',
  'approved'
);
