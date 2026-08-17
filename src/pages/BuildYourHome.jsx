import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../App.jsx';
import { 
  CheckCircle2, Clock, ShieldCheck, Award, Home, Hammer, 
  Sparkles, Check, ChevronDown, ChevronUp, Star, Phone, 
  Layers, Zap, Droplet, PaintBucket, Key, ArrowRight, UserCheck, 
  TrendingUp, Compass, FileText, Wrench
} from 'lucide-react';

export default function BuildYourHome() {
  const { setLeads } = useContext(AppContext);
  const [activePackageTab, setActivePackageTab] = useState('premium');
  const [openFaq, setOpenFaq] = useState(null);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    plotSize: '',
    budget: '',
    propertyType: 'Independent House',
    requirement: 'Full Turnkey (Design to Handover)',
    callbackTime: 'Morning (9 AM - 12 PM)',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill in your Name and Phone Number.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: `${formData.phone}@turnkeyclient.in`,
        service: `Turnkey Home Construction - ${formData.propertyType}`,
        plotSize: formData.plotSize,
        budget: formData.budget,
        city: formData.city,
        requirement: formData.requirement,
        callbackTime: formData.callbackTime,
        message: `Plot: ${formData.plotSize || 'N/A'} sq.ft | Budget: ${formData.budget || 'N/A'} | Callback: ${formData.callbackTime} | Note: ${formData.message || 'Consultation Request'}`,
        status: 'New'
      };
      const res = await axios.post('/api/leads', payload).catch(() => ({ data: payload }));
      if (setLeads) {
        setLeads((prev) => [res.data || payload, ...(prev || [])]);
      }
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [faqCategory, setFaqCategory] = useState('all');
  const [faqSearch, setFaqSearch] = useState('');

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      id: 1,
      category: 'process',
      categoryLabel: 'Turnkey & Process',
      q: 'What is Turnkey Construction?',
      a: 'Turnkey Construction is an all-inclusive delivery model where a single professional firm manages the complete project lifecycle — from architectural planning, 3D designs, structural engineering, and raw material procurement to civil construction, electrical, plumbing, flooring, painting, modular kitchen, and final deep cleaning. You receive the keys to a 100% finished, ready-to-move home without the stress of coordinating multiple contractors.'
    },
    {
      id: 2,
      category: 'pricing',
      categoryLabel: 'Cost & Pricing',
      q: 'How is the total construction cost calculated?',
      a: 'Construction cost is calculated based on the total built-up area (sq.ft) of your proposed home and your selected package tier (Essential, Premium, or Luxury). We provide an itemized Bill of Quantities (BOQ) with fixed unit rates and specified brands, ensuring zero budget escalations.'
    },
    {
      id: 3,
      category: 'process',
      categoryLabel: 'Turnkey & Process',
      q: 'Are architectural and structural designs included?',
      a: 'Yes, comprehensive design services are fully included: 2D Vastu-compliant floor layouts, 3D photorealistic exterior elevations, structural engineering drawings, and complete MEP (Mechanical, Electrical, Plumbing) schematics.'
    },
    {
      id: 4,
      category: 'materials',
      categoryLabel: 'Materials & Quality',
      q: 'Can customers customize materials and finish selections?',
      a: 'Absolutely! You can choose your preferred floor tiles, sanitary fixtures, switches, wall paint shades, and modular kitchen laminate finishes through our physical sample catalog and dedicated design consultations.'
    },
    {
      id: 5,
      category: 'materials',
      categoryLabel: 'Materials & Quality',
      q: 'Which brand specifications are used for construction?',
      a: 'We strictly build with certified Tier-1 ISI grade brands: UltraTech / ACC Cement, Tata Tiscon / Jindal Panther Fe 550D TMT Steel, Kajaria / Somany Tiles, Jaquar / Hindware Sanitaryware, Havells / Polycab FRLS Wires, Anchor Roma Modular Switches, and Asian Paints Royale / Dulux Paints.'
    },
    {
      id: 6,
      category: 'timeline',
      categoryLabel: 'Timeline & Warranty',
      q: 'What is the standard construction timeline?',
      a: 'A typical 2,000 to 3,500 sq.ft. independent home or villa is completed and handed over within 8 to 12 months. All milestone timelines and delivery schedules are legally contracted with strict stage deadlines.'
    },
    {
      id: 7,
      category: 'process',
      categoryLabel: 'Turnkey & Process',
      q: 'Is a preliminary site visit and feasibility evaluation available?',
      a: 'Yes, our senior civil engineers and architects visit your plot to perform a complimentary soil inspection, road access review, and feasibility assessment before drafting initial plans.'
    },
    {
      id: 8,
      category: 'pricing',
      categoryLabel: 'Cost & Pricing',
      q: 'How does the payment milestone structure work?',
      a: 'Payments are linked to transparent, verified construction stages (e.g., Foundation Completion, Ground Floor Slab, First Floor Slab, Masonry & Plaster, MEP & Flooring, Final Handover). You only pay for the next stage once the previous milestone passes structural quality audits.'
    },
    {
      id: 9,
      category: 'pricing',
      categoryLabel: 'Cost & Pricing',
      q: 'Are there any hidden costs or surprise charges?',
      a: 'None. The initial contract, detailed BOQ, and brand specifications are 100% legally binding. Any optional scope additions requested by you during construction are separately quoted and approved before execution.'
    },
    {
      id: 10,
      category: 'process',
      categoryLabel: 'Turnkey & Process',
      q: 'How can I track daily or weekly construction progress?',
      a: 'Your assigned Project Manager provides regular updates through our customer portal and WhatsApp, including high-resolution site photographs, video walk-throughs, and milestone progress reports.'
    },
    {
      id: 11,
      category: 'process',
      categoryLabel: 'Turnkey & Process',
      q: 'Can design modifications be made after signing?',
      a: 'Unlimited revisions are permitted during the architectural design phase. Minor changes during ongoing construction can also be accommodated through mutual technical approval.'
    },
    {
      id: 12,
      category: 'process',
      categoryLabel: 'Turnkey & Process',
      q: 'Do you also undertake full home renovations and remodeling?',
      a: 'Yes, we execute full-scale structural renovations, floor additions, structural remodeling, and interior turnkey fit-outs.'
    },
    {
      id: 13,
      category: 'timeline',
      categoryLabel: 'Timeline & Warranty',
      q: 'What warranty is provided upon completion?',
      a: 'Every home we construct is protected by a 10-Year Structural Warranty and a 1-Year Comprehensive Free Maintenance & Seepage Warranty.'
    },
    {
      id: 14,
      category: 'timeline',
      categoryLabel: 'Timeline & Warranty',
      q: 'What support is available after handover?',
      a: 'Our dedicated Customer Care team provides post-handover support for 12 months, assisting with routine touch-ups, snag rectifications, and periodic structural check-ups at no extra cost.'
    }
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = faqCategory === 'all' || f.category === faqCategory;
    const matchesSearch = !faqSearch.trim() || 
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
      f.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [checklistStage, setChecklistStage] = useState('all');
  const [checklistSearch, setChecklistSearch] = useState('');

  const checklistStages = [
    { key: 'all', label: 'All Checkpoints', count: 108 },
    { key: 'foundation', label: 'Foundation & Substructure', count: 18 },
    { key: 'structure', label: 'RCC Structure & Core', count: 22 },
    { key: 'masonry', label: 'Brickwork & Plastering', count: 18 },
    { key: 'waterproofing', label: 'Waterproofing & Plumbing', count: 20 },
    { key: 'electrical', label: 'Electrical & Safety', count: 16 },
    { key: 'finishing', label: 'Finishing & Handover', count: 14 }
  ];

  const checklistItems = [
    // Foundation & Earthwork (18 items)
    { id: 'CHK-001', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Soil Bearing Capacity (SBC) Lab Test', standard: 'IS 1892 / IS 2131', desc: 'Plate load & core drill testing to verify soil stratum load capability before structural design.' },
    { id: 'CHK-002', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Anti-Termite Ground Chemical Barrier', standard: 'IS 6313 (Part 2)', desc: 'Pre-construction chemical emulsifier trench application across bottom and sides of all excavation pits.' },
    { id: 'CHK-003', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Triangulation & Plot Diagonal Verification', standard: 'Pythagorean 3:4:5 Check', desc: 'Precise total station survey verification to ensure exact 90° boundary angles and setbacks.' },
    { id: 'CHK-004', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Benchmark Level & Excavation Depth', standard: 'Auto-Level Survey', desc: 'Excavation depth validation against permanent municipal road benchmark to prevent differential settling.' },
    { id: 'CHK-005', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Sub-base Compaction & Moisture Audit', standard: 'IS 2720 (Part 28)', desc: 'Mechanical plate rammer compaction until sub-base achieves 95% dry density test rating.' },
    { id: 'CHK-006', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'PCC 1:4:8 Bed Casting & Leveling', standard: 'IS 456 M7.5 Spec', desc: '100mm uniform plain cement concrete bed casting providing an impervious foundation base.' },
    { id: 'CHK-007', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Footing Mesh Rebar Spacing & Quality', standard: 'IS 1786 Fe 550D', desc: 'Verification of TMT steel bar gauge, hook bends, center-to-center spacing, and binding wire strength.' },
    { id: 'CHK-008', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Concrete Cover Block (50mm) Placement', standard: 'IS 456 Clause 26.4', desc: 'High-density fiber/concrete cover blocks to prevent footing reinforcement corrosion over 50+ years.' },
    { id: 'CHK-009', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Column Starter Rebar Centering & Plumb', standard: 'IS 456 Structural Drawings', desc: 'Laser-checked column axial coordinates ensuring exact load alignment from foundation to roof.' },
    { id: 'CHK-010', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Column Stirrup 135° Hook Angle Detailing', standard: 'IS 13920 Earthquake Code', desc: 'Seismic ductile stirrups with 135° inner bend hooks and 10d extension to resist lateral earth tremors.' },
    { id: 'CHK-011', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Ready-Mix Concrete Slump Cone Test', standard: 'IS 1199 (75–100mm Slump)', desc: 'Workability and water-cement ratio verification for every concrete batch prior to footing pouring.' },
    { id: 'CHK-012', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Concrete Test Cube Sampling (6 Cubes)', standard: 'IS 516 Testing Protocol', desc: 'Standard 150mm cast cubes sampled on site for certified 7-day (65%) and 28-day (100%) crushing lab tests.' },
    { id: 'CHK-013', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Needle Vibrator Compaction Audit', standard: 'IS 2505 Compliance', desc: 'Systematic 40mm/60mm needle vibrator penetration to eliminate internal voids and honeycombing.' },
    { id: 'CHK-014', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Shuttering De-molding & Surface Audit', standard: 'IS 456 Table 12', desc: 'Minimum 24-hour curing check before formwork stripping and surface honeycombing inspection.' },
    { id: 'CHK-015', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Foundation Ponding Curing (10 Days)', standard: 'Continuous Water Ponding', desc: 'Daily water curing check to ensure full hydration and maximum design strength gain.' },
    { id: 'CHK-016', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Layered Backfilling with Water Consolidation', standard: 'IS 2720 Layer Method', desc: 'Soil backfilling in maximum 150mm watered layers with mechanical compaction around footings.' },
    { id: 'CHK-017', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Plinth Beam Rebar Fabrication & Shuttering', standard: 'Structural CAD Drawings', desc: 'Continuous longitudinal rebar with overlap stagger at L/3 zones and rigid ply shuttering alignment.' },
    { id: 'CHK-018', stage: 'foundation', stageLabel: 'Foundation & Substructure', title: 'Damp Proof Course (DPC) 50mm + Dr. Fixit', standard: 'IS 2645 Waterproof Barrier', desc: '1:2:4 M15 concrete plinth barrier with integral waterproofing compound preventing rising dampness.' },

    // RCC Structure & Core (22 items)
    { id: 'CHK-019', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'TMT Steel Batch Lab Mill Test Certificates', standard: 'IS 1786 Fe 550D / NABL', desc: 'Physical yield strength, elongation percentage, and chemical composition batch certificate verification.' },
    { id: 'CHK-020', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Cement Freshness & Bag Seal Audit', standard: 'IS 269 / IS 8112 (<60 Days)', desc: '53 Grade OPC/PPC cement factory date check to guarantee zero moisture lump formation.' },
    { id: 'CHK-021', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Column Verticality with Plumb Bob & Laser', standard: 'IS 456 (3mm Max Deviation)', desc: 'Multi-point verticality check on column formwork before and after concrete casting.' },
    { id: 'CHK-022', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Cover Block Placement across Beams & Columns', standard: 'Columns 40mm | Beams 25mm', desc: 'Factory-cured concrete cover blocks tied at 1-meter grid intervals.' },
    { id: 'CHK-023', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Beam Lapping Staggering & Anchorage Length', standard: 'IS 456 Ld (50d Minimum)', desc: 'Rebar overlap staggering in non-critical zones with 50-diameter development length.' },
    { id: 'CHK-024', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Slab Two-Way Reinforcement Spacing', standard: 'Structural Grid Schedule', desc: 'Main bars and distribution bars spacing verified with measuring tape before conduit layout.' },
    { id: 'CHK-025', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Chair Rebar Supports for Top Mat Steel', standard: 'IS 456 Rebar Support Code', desc: 'Heavy-duty steel chairs placed at 1.0m intervals to prevent top reinforcement sagging under foot traffic.' },
    { id: 'CHK-026', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Embedded Electrical PVC Conduit Routing', standard: 'Heavy Medium Conduit Class', desc: 'Fan boxes, light points, and switch drop conduits secured with binding wire and tape before slab pour.' },
    { id: 'CHK-027', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Plumbing Slab Sleeve Pipe Penetrations', standard: 'PVC Core Sleeve Markers', desc: 'Accurate placement of drainage sleeves to prevent core-drilling damage to cast RCC slabs later.' },
    { id: 'CHK-028', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Formwork Staging & Acrow Prop Rigidity', standard: 'IS 14687 Formwork Safety', desc: 'Steel props vertically aligned with cross-bracing and non-yielding base plates to support wet concrete weight.' },
    { id: 'CHK-029', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Pre-Pour Shuttering Cleaning & Washing', standard: 'Compressed Air & Water Jet', desc: 'Removal of all sawdust, tie wire scraps, and debris from slab and beam formwork before pour approval.' },
    { id: 'CHK-030', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Slab Thickness Level Pins Installation', standard: 'Auto-Level Level Pins', desc: 'Preset level markers across the entire floor slab to guarantee uniform 125mm–150mm slab thickness.' },
    { id: 'CHK-031', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Concrete Design Mix (M20/M25) Control', standard: 'IS 10262 Mix Protocol', desc: 'Controlled water-cement ratio (0.45) with superplasticizer for high early strength and zero cracking.' },
    { id: 'CHK-032', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Slump Testing for Every Concrete Batch', standard: 'IS 1199 Slump Verification', desc: 'Every ready-mix batch verified on site for 90mm–120mm pumpable slump before discharge.' },
    { id: 'CHK-033', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Slab Pouring Vibration & Air Removal', standard: 'IS 2505 Vibrator Protocol', desc: 'Continuous double needle vibrator operation ensuring zero void formation beneath bottom rebar.' },
    { id: 'CHK-034', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Slab Surface Floating & Bull Float Finish', standard: 'Trowel Leveling', desc: 'Initial surface leveling and smoothing to prevent plastic shrinkage cracks during early setting.' },
    { id: 'CHK-035', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Slab Ponding Bunds Creation (24 Hours)', standard: 'Cement Mortar Bunds', desc: 'Grid bunds formed on slab surface within 24 hours to hold standing water for mandatory curing.' },
    { id: 'CHK-036', stage: 'structure', stageLabel: 'RCC Structure & Core', title: '14-Day Continuous Water Curing Audit', standard: 'IS 456 Curing Protocol', desc: 'Daily site engineer inspection verifying full water ponding coverage across entire floor slab.' },
    { id: 'CHK-037', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Prop Stripping Schedule Compliance', standard: 'IS 456 Clause 11.3', desc: 'Props retained: Slabs under 4.5m (7 days), Slabs over 4.5m (14 days), Beams/Arches (21 days).' },
    { id: 'CHK-038', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Staircase Waist Slab & Riser Dimension Check', standard: 'Architectural Specs', desc: 'Uniform riser height (150mm) and tread width (275mm) with diagonal rebar anchorage into floor beams.' },
    { id: 'CHK-039', stage: 'structure', stageLabel: 'RCC Structure & Core', title: 'Parapet Wall Starter Rebar Dowels', standard: 'IS 456 Dowel Detailing', desc: '10mm rebar dowels cast in slab edge for monolithic connection with terrace parapet wall.' },
    { id: 'CHK-040', stage: 'structure', stageLabel: 'RCC Structure & Core', title: '28-Day Compressive Strength Lab Certificate', standard: 'IS 516 Lab Verification', desc: 'Mandatory NABL lab certificate verifying M20/M25 concrete achieved > 100% design target strength.' },

    // Brickwork & Plastering (18 items)
    { id: 'CHK-041', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Red Brick / AAC Block Quality & Density', standard: 'IS 1077 / IS 2185', desc: 'Compressive strength test (> 3.5 N/mm²) and water absorption test (< 20% by weight).' },
    { id: 'CHK-042', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'AAC Block Adhesive Joint Thickness (3mm)', standard: 'Thin-bed Mortar Standard', desc: 'Uniform 3mm polymer adhesive bed with zero thermal bridging or hollow horizontal joints.' },
    { id: 'CHK-043', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Column Concrete Surface Hacking (300/m²)', standard: 'IS 2250 Bonding Code', desc: 'Mechanical chipping of smooth RCC column faces to create mechanical interlock with mortar.' },
    { id: 'CHK-044', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'GI Chicken Wire Mesh at RCC-Brick Joints', standard: 'IS 1542 Anti-Crack Standard', desc: '200mm wide galvanized wire mesh fixed across all column-wall joints to eliminate hairline cracks.' },
    { id: 'CHK-045', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Masonry Mortar Mix Ratio (1:4 & 1:6)', standard: 'IS 2250 Box Batching', desc: 'Gauge box measurement for cement and washed river/M-sand ensuring exact mix proportion.' },
    { id: 'CHK-046', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Wall Plumb Line & Right-Angle Tri-Square', standard: '3mm per 3m Tolerance', desc: 'Continuous plumb bob inspection on all corners to guarantee razor-straight vertical walls.' },
    { id: 'CHK-047', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Continuous RCC Lintel Beam & Chajja Casting', standard: 'IS 456 Lintel Design', desc: 'Full RCC lintel band above all door/window openings with 150mm minimum bearing on brickwork.' },
    { id: 'CHK-048', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Window Concrete Sill Band Casting', standard: 'Anti-Crack Sill Spec', desc: 'Reinforced 75mm sill band under all window frames to stop diagonal stress cracks in walls.' },
    { id: 'CHK-049', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Door Frame MS Holdfast Grouting', standard: 'IS 4021 Holdfast Code', desc: 'Minimum 6 heavy-duty steel holdfasts per door frame embedded in solid 1:2:4 concrete pockets.' },
    { id: 'CHK-050', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Wall Chasing with Electric Groove Cutter', standard: 'Mechanical Wall Chaser', desc: 'Strict ban on manual hammer chipping; groove cutters used to protect structural masonry strength.' },
    { id: 'CHK-051', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Masonry Joint Curing (7 Days)', standard: 'IS 2250 Curing Standard', desc: 'Twice-daily water curing on fresh brick masonry walls to reach maximum mortar bond strength.' },
    { id: 'CHK-052', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'External Plaster Waterproofing Admixture', standard: 'Dr. Fixit 101 LW+ (IS 2645)', desc: 'Integral waterproofing compound mixed in external sand-faced double coat plaster.' },
    { id: 'CHK-053', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Internal Gypsum / Single-Coat Plaster Level', standard: 'IS 1661 Finish Standard', desc: 'Aluminum straight-edge check ensuring smooth plane finish with zero bumps or waviness.' },
    { id: 'CHK-054', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Internal 90° Room Corner True-Angle Check', standard: 'Steel Tri-Square Check', desc: 'Every corner checked with engineer square to ensure perfect furniture and tile fit later.' },
    { id: 'CHK-055', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Plaster Surface Water Curing (10 Days)', standard: 'Water Spray Curing', desc: 'Curing on cement plaster to prevent shrinkage crazing and ensure rock-solid bond.' },
    { id: 'CHK-056', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Terrace Parapet Coping Concrete Band', standard: 'Drip Mold Edge Spec', desc: 'Sloped concrete coping on parapet with bottom groove to stop rainwater streaks on exterior walls.' },
    { id: 'CHK-057', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Loft & Wardrobe Niche Dimension Alignment', standard: 'Architectural CAD Drawings', desc: 'Diagonal and depth verification ensuring modular cabinets fit without on-site cutting.' },
    { id: 'CHK-058', stage: 'masonry', stageLabel: 'Brickwork & Plastering', title: 'Wall Surface Moisture Meter Test (< 12%)', standard: 'Electronic Moisture Sensor', desc: 'Digital moisture reading taken before allowing primer or putty application on walls.' },

    // Waterproofing & Plumbing (20 items)
    { id: 'CHK-059', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Terrace 72-Hour Water Ponding Test', standard: 'IS 3067 Ponding Protocol', desc: '100mm standing water held on terrace for 72 hours; slab underside inspected for zero dampness.' },
    { id: 'CHK-060', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Terrace 2-Coat Elastomeric Polymer Membrane', standard: 'Dr. Fixit Fastflex / Sika', desc: 'Flexible elastomeric waterproofing membrane applied with fiber-mesh reinforcement over slab.' },
    { id: 'CHK-061', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Terrace Protective Screed with 1:100 Slope', standard: 'Gravity Drain Slope', desc: 'M15 screed concrete layer sloping directly into rainwater drain spouts to prevent puddling.' },
    { id: 'CHK-062', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Bathroom Sunken Slab Crystalline Coating', standard: 'IS 1346 Waterproof Spec', desc: 'Heavy crystalline waterproofing with coving fillet mortar at all floor-to-wall 90° junctions.' },
    { id: 'CHK-063', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Bathroom Sunken 48-Hour Water Pond Test', standard: 'Zero-Drop Water Gauge', desc: 'Sunken slab filled with water and checked with laser gauge before pipe laying and brickbat filling.' },
    { id: 'CHK-064', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'CPVC Hot/Cold Supply Hydrostatic Pressure Test', standard: '10 kg/cm² for 4 Hours', desc: 'Hydraulic pressure test pump verification across all concealed water lines before wall closure.' },
    { id: 'CHK-065', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'SWR PVC Drain Pipes Slope Gradient (1:40)', standard: 'IS 1729 Gravity Fall', desc: 'Spirit level slope verification on all waste lines ensuring high self-cleansing velocity.' },
    { id: 'CHK-066', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Multi-Floor Stack Vent Pipe Terminal', standard: 'IS 5329 Plumbing Code', desc: 'Full-diameter roof vent pipe installation preventing sewer gas back-drafts into bathrooms.' },
    { id: 'CHK-067', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Underground Sump Dual-Coat Waterproofing', standard: 'Food-Grade Waterproofing', desc: 'Non-toxic, potable water compliant waterproofing applied to all domestic water storage tanks.' },
    { id: 'CHK-068', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Overhead Tank Antimicrobial Waterproofing', standard: 'Potable Water Safe', desc: 'Hygienic coating preventing algae growth and water infiltration into structural roof slab.' },
    { id: 'CHK-069', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Deep Seal Water Trap on All Floor Drains', standard: 'Anti-Odor Nahani Trap', desc: '50mm water seal depth guaranteed on all floor drains to block foul sewer odors permanently.' },
    { id: 'CHK-070', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Concealed Bath Diverter Level & Alignment', standard: 'Laser Level Alignment', desc: 'Diverter body plumbed flush with expected tile thickness to ensure clean trim installation.' },
    { id: 'CHK-071', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Rainwater Harvesting Filter Chamber Link', standard: 'Municipal Green Norms', desc: 'Rooftop rainwater channeled through leaf filter into recharge pit / secondary tank.' },
    { id: 'CHK-072', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Inspection Chamber & Gully Trap Gradients', standard: 'IS 4127 Drainage Code', desc: 'Smooth concrete benching inside chambers for uninterrupted sewage flow to main municipal line.' },
    { id: 'CHK-073', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Vertical Pipe Shaft Acoustic & Clamping Audit', standard: 'Rubber-Lined GI Clamps', desc: 'Heavy-duty pipe clamping at 1.2m intervals preventing water hammer noise and pipe vibration.' },
    { id: 'CHK-074', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Cleanout Access Plugs at Every 90° Turn', standard: 'UPVC Cleanout Code', desc: 'Threaded inspection plugs installed at pipe bends for rapid future drain maintenance.' },
    { id: 'CHK-075', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'RO Purifier Loop & Kitchen Sink Drain Test', standard: 'Full Flow Sink Discharge', desc: 'Dedicated drain trap and RO reject line connection preventing kitchen cabinet dampness.' },
    { id: 'CHK-076', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Solar Water Heater Loop Pressure Verification', standard: 'High-Temp CPVC Grade', desc: 'Thermal expansion rated CPVC piping tested under hot water operational cycle.' },
    { id: 'CHK-077', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Water Pressure Booster Pump Flow Rate Test', standard: 'Constant 2.5–3.5 Bar Flow', desc: 'Equal water pressure delivery tested across all simultaneous shower and faucet points.' },
    { id: 'CHK-078', stage: 'waterproofing', stageLabel: 'Waterproofing & Plumbing', title: 'Final Comprehensive Sanitary Flow Audit', standard: '100% Outlet Inspection', desc: 'Full operation of every WC flush, bidet, basin faucet, and shower before client walkthrough.' },

    // Electrical & Safety (16 items)
    { id: 'CHK-079', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'FRLS Copper Wire Batch Testing (Polycab/Havells)', standard: 'IS 694 / IS 17043', desc: 'Fire-Retardant Low Smoke (FRLS) 100% pure electrolytic copper wire gauge verification.' },
    { id: 'CHK-080', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Dedicated High-Load Circuit Conduits (4.0 sq.mm)', standard: 'IS 732 Wiring Standard', desc: 'Direct separate homerun circuits for Air Conditioners, Water Heaters, Induction, and EV Charger.' },
    { id: 'CHK-081', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Megger Insulation Resistance Testing (> 1 MΩ)', standard: 'IS 732 Megger Test', desc: 'High-voltage insulation test between conductors and earth ensuring zero electrical leakage.' },
    { id: 'CHK-082', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Chemical Earth Pit Resistance (< 2.0 Ohms)', standard: 'IS 3043 Earthing Code', desc: 'Copper bonded earth electrode with carbon-bentonite compound verified with digital earth tester.' },
    { id: 'CHK-083', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Human Life Protection 30mA RCCB / ELCB', standard: 'IS 12640 Shock Safety', desc: 'Residual Current Circuit Breakers installed on all domestic lighting and power sub-circuits.' },
    { id: 'CHK-084', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'MCB Type B/C Curve Matching with Wire Capacity', standard: 'IS/IEC 60898 Standards', desc: 'Miniature Circuit Breakers calibrated to trip before wire overheating under overcurrent load.' },
    { id: 'CHK-085', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Neutral Line Separation & Color Code Standards', standard: 'Red/Yellow/Blue/Black/Green', desc: 'Individual neutral lines per circuit preventing neutral overload and false tripping of RCCBs.' },
    { id: 'CHK-086', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Inverter / UPS Essential Load Looping', standard: 'Dedicated Inverter Line', desc: 'Pre-wired inverter looping to all bedroom fans, master lights, WiFi router, and refrigerator.' },
    { id: 'CHK-087', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Cat-6 LAN & RG-6 Coaxial Signal Shielding', standard: 'Gigabit Certified Cabling', desc: 'Data conduits routed minimum 200mm away from high-voltage AC cables to eliminate signal noise.' },
    { id: 'CHK-088', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Switchboard Height & Spirit Level Alignment', standard: 'Standard 1200mm / 450mm', desc: 'Laser level alignment for modular switch plates matching architectural interior drawings.' },
    { id: 'CHK-089', stage: 'electrical', stageLabel: 'Electrical & Safety', title: '3-Pin Socket Earth Continuity Verification', standard: 'Digital Loop Tester', desc: 'Polarity (Phase on Right, Neutral on Left, Earth on Top) verified across 100% of wall sockets.' },
    { id: 'CHK-090', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Concealed Footlights & Motion Sensor Wiring', standard: 'Staircase Safety Code', desc: 'Low-voltage footlight conduits embedded at staircase steps and master bedroom corridors.' },
    { id: 'CHK-091', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Fire-Retardant PVC Conduits in False Ceilings', standard: 'IS 9537 Part 3', desc: 'Heavy-gauge flexible metal/FRLS PVC conduits secured with saddles above all gypsum ceilings.' },
    { id: 'CHK-092', stage: 'electrical', stageLabel: 'Electrical & Safety', title: '3-Phase Incoming Load Balancing Test', standard: 'Current Clamp Meter Audit', desc: 'Equal electrical load distribution across R-Y-B phases to prevent neutral voltage fluctuations.' },
    { id: 'CHK-093', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'EV Car Charger Dedicated Power Terminal', standard: '32A / 7.2 kW Ready', desc: 'Dedicated 6 sq.mm 32A isolator box pre-installed in parking for electric vehicle fast charging.' },
    { id: 'CHK-094', stage: 'electrical', stageLabel: 'Electrical & Safety', title: 'Full Electrical Load & Short Circuit Trip Test', standard: 'Live Load Commissioning', desc: 'Full appliance load simulated simultaneously for 60 minutes with thermal infrared heat scan.' },

    // Finishing & Handover (14 items)
    { id: 'CHK-095', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Vitrified Tile Batch Shade & Warpage Audit', standard: 'IS 15622 (Grade 1 Tiles)', desc: 'Zero shade variation and < 0.2% edge warpage across large format 800x1600mm floor tiles.' },
    { id: 'CHK-096', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Tile Hollow Sound Rubber Mallet Tap Test', standard: '100% Floor Sound Audit', desc: 'Every floor and wall tile tapped with rubber mallet; any hollow corner is marked and re-laid.' },
    { id: 'CHK-097', stage: 'finishing', stageLabel: 'Finishing & Handover', title: '2mm Epoxy Tile Grouting & Alignment Spacers', standard: 'Anti-Stain Epoxy Grout', desc: 'Epoxy resin grouting in bathrooms and kitchens preventing grime buildup and water seepage.' },
    { id: 'CHK-098', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Granite Counter Chamfer & Bullnose Polishing', standard: 'Mirror Polished Edges', desc: 'Factory machine polished edges on kitchen counters, staircase treads, and window sills.' },
    { id: 'CHK-099', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Bathroom Floor Anti-Skid Slope to Drain', standard: '1:60 Water Runoff Slope', desc: 'Water droplet flow test verifying zero puddle formation on bathroom and balcony floors.' },
    { id: 'CHK-100', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Modular Kitchen Waterproof HDHMR Carcass', standard: 'Action TESA HDHMR Grade', desc: 'Water-resistant, termite-proof high-density boards with 1mm edge banding on all exposed sides.' },
    { id: 'CHK-101', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Soft-Close Hardware & Drawer Channel Test', standard: 'Hettich / Hafele 100k Cycles', desc: 'Smooth gliding and automatic soft-closing action tested on all kitchen baskets and wardrobe shutters.' },
    { id: 'CHK-102', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Main Teakwood Door Seasoning & Frame Plumb', standard: 'Moisture < 10% Kiln Dried', desc: 'Solid wood frame anchored securely with acoustic weather strip and mortise lock smooth operation.' },
    { id: 'CHK-103', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'UPVC / Aluminum Window Rain Track Drainage', standard: 'Wind Pressure & Rain Sealed', desc: 'Double silicone sealant around frame exterior and unobstructed internal rain drain slots.' },
    { id: 'CHK-104', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Paint Sheen Uniformity & Halogen Light Audit', standard: 'Asian Paints Royale Spec', desc: 'Halogen inspection light held at angle to catch and polish micro-flaws before final paint coat.' },
    { id: 'CHK-105', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Balcony Toughened Glass & SS Railing Load Test', standard: 'IS 875 Impact Standard', desc: '12mm toughened safety glass and SS 304 grade railing anchored to withstand 1.5 kN/m lateral force.' },
    { id: 'CHK-106', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'Deep Post-Construction Site Sanitization', standard: 'Professional Deep Clean', desc: 'Industrial floor scrubbing, window glass acid-free cleaning, and complete vacuuming.' },
    { id: 'CHK-107', stage: 'finishing', stageLabel: 'Finishing & Handover', title: 'As-Built Architectural & MEP Drawing Handover', standard: 'Complete CAD Blueprint Set', desc: 'Permanent laminated drawing pack of hidden electrical and plumbing conduits for future reference.' },
    { id: 'CHK-108', stage: 'finishing', stageLabel: 'Finishing & Handover', title: '10-Year Structural Warranty Certificate Issuance', standard: 'Legal Structural Guarantee', desc: 'Formal handover dossier including warranty documentation, manufacturer guarantee cards, and keys.' }
  ];

  const filteredChecklist = checklistItems.filter((item) => {
    const matchesStage = checklistStage === 'all' || item.stage === checklistStage;
    const matchesSearch = !checklistSearch.trim() || 
      item.title.toLowerCase().includes(checklistSearch.toLowerCase()) || 
      item.standard.toLowerCase().includes(checklistSearch.toLowerCase()) || 
      item.desc.toLowerCase().includes(checklistSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(checklistSearch.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="turnkey-page animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="turnkey-hero-section">
        <div className="container">
          <div className="turnkey-hero-grid">
            <div className="turnkey-hero-content">
              <span className="turnkey-pill-badge">
                <Sparkles style={{ width: '15px', height: '15px' }} />
                Premium Turnkey Home Construction
              </span>
              
              {/* Preserved Main Headline as explicitly requested by user */}
              <h1 className="turnkey-hero-title">
                Apne Sapno Ka Ghar Banaiye — <span className="highlight-text">Design Se Lekar Handover Tak</span>, Sab Kuch Ek Hi Jagah.
              </h1>

              <p className="turnkey-hero-subtext">
                <strong>Complete Turnkey Construction:</strong> Architecture, materials, skilled workforce, and project management — all managed seamlessly by a single verified team tailored to your budget and custom requirements.
              </p>

              <div className="turnkey-hero-ctas">
                <button 
                  type="button" 
                  className="btn-turnkey-primary"
                  onClick={() => scrollToSection('turnkey-lead-form')}
                >
                  Get Free Consultation →
                </button>
                <button 
                  type="button" 
                  className="btn-turnkey-secondary"
                  onClick={() => scrollToSection('turnkey-packages')}
                >
                  View Packages & Rates
                </button>
              </div>

              {/* Trust Metrics Bar */}
              <div className="turnkey-trust-stats">
                <div className="trust-stat-box">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Homes Delivered</span>
                </div>
                <div className="trust-stat-divider"></div>
                <div className="trust-stat-box">
                  <span className="stat-number">12+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="trust-stat-divider"></div>
                <div className="trust-stat-box">
                  <span className="stat-number">250+</span>
                  <span className="stat-label">Active Projects</span>
                </div>
                <div className="trust-stat-divider"></div>
                <div className="trust-stat-box">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Cities Served</span>
                </div>
              </div>
            </div>

            <div className="turnkey-hero-media">
              <div className="turnkey-hero-img-card">
                <img 
                  src="assets/turnkey_hero_home.jpg" 
                  alt="Luxury Completed Turnkey Home" 
                  className="turnkey-main-hero-img"
                />
                <div className="hero-floating-badge">
                  <ShieldCheck className="badge-icon" />
                  <div>
                    <strong>10-Year Warranty</strong>
                    <span>100% Quality Guaranteed</span>
                  </div>
                </div>
                <div className="hero-floating-badge-2">
                  <Clock className="badge-icon" />
                  <div>
                    <strong>On-Time Handover</strong>
                    <span>8–12 Months Execution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT IS TURNKEY CONSTRUCTION? */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Simplified Construction</span>
            <h2>What is Turnkey Construction?</h2>
            <p className="section-desc-p">
              “You simply share your plot details, vision, and budget. Our dedicated team takes end-to-end responsibility — from architectural blueprints, municipal planning, and raw material sourcing to civil construction, MEP, luxury finishing, and final key handover.”
            </p>
          </div>

          {/* Visual Step Flow */}
          <div className="turnkey-visual-flow">
            {[
              { step: '01', title: 'Requirement', icon: '📝' },
              { step: '02', title: 'Design', icon: '📐' },
              { step: '03', title: 'Estimate', icon: '💰' },
              { step: '04', title: 'Planning', icon: '📋' },
              { step: '05', title: 'Construction', icon: '🏗️' },
              { step: '06', title: 'Finishing', icon: '🎨' },
              { step: '07', title: 'Inspection', icon: '🔍' },
              { step: '08', title: 'Handover', icon: '🔑' }
            ].map((item, idx) => (
              <div key={idx} className="flow-step-node">
                <div className="flow-icon-circle">
                  <span className="flow-emoji">{item.icon}</span>
                  <span className="flow-step-num">{item.step}</span>
                </div>
                <h4 className="flow-node-title">{item.title}</h4>
                {idx < 7 && <span className="flow-connector-arrow">➔</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHAT WE HANDLE */}
      <section className="turnkey-section">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">End-to-End Scope</span>
            <h2>What We Handle For You</h2>
            <p className="section-desc-p">
              From initial architectural blueprints to the final key in your hand, every phase is engineered with precision.
            </p>
          </div>

          <div className="handle-cards-grid">
            {[
              { title: 'Architectural Design', desc: '2D floor plans, 3D elevation renders, structural drawings, and Vastu-compliant layouts.', icon: Compass },
              { title: 'Structural Engineering', desc: 'Soil testing, load calculations, and seismic-resistant RCC foundation engineering.', icon: Layers },
              { title: 'Civil Construction', desc: 'High-grade masonry, concrete slab casting, RCC columns, and precision plastering.', icon: Hammer },
              { title: 'Electrical Work', desc: 'Concealed FRLS copper wiring, distribution boards, and modular switch plates.', icon: Zap },
              { title: 'Plumbing & Drainage', desc: 'Leak-proof CPVC/UPVC water piping, sanitaryware, and underground drainage lines.', icon: Droplet },
              { title: 'Premium Flooring', desc: 'Vitrified marble floor tiles, natural granite steps, and wooden laminate flooring.', icon: Home },
              { title: 'Wall Painting & Putty', desc: 'Smooth acrylic wall putty, primer coats, and washable luxury emulsion finishes.', icon: PaintBucket },
              { title: 'Doors & Windows', desc: 'Teak/flush main doors, stainless steel hardware, and soundproof UPVC windows.', icon: Home },
              { title: 'Modular Kitchen', desc: 'Waterproof marine ply cabinetry, soft-close drawers, and polished granite countertops.', icon: Wrench },
              { title: 'Bathroom Fixtures', desc: 'Wall-hung closets, hot & cold diverters, glass shower partitions, and chrome fittings.', icon: Droplet },
              { title: 'Modern Lighting', desc: 'Recessed false ceiling LED panels, chandeliers, and ambient cove illumination.', icon: Zap },
              { title: 'Landscaping & Driveway', desc: 'Interlocking paver blocks, porch roofing, boundary walls, and manicured green turf.', icon: Sparkles },
              { title: 'Deep Site Cleaning', desc: 'Post-construction debris clearance, glass scrubbing, and complete home sanitization.', icon: CheckCircle2 },
              { title: 'Final Handover & Keys', desc: 'Formal key handover ceremony, structural warranty certificate, and complete drawing archives.', icon: Key }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="handle-service-card">
                  <div className="handle-icon-wrapper">
                    <IconComp style={{ width: '24px', height: '24px' }} />
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. OUR PROCESS */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Transparent Roadmap</span>
            <h2>Our Turnkey Construction Process</h2>
            <p className="section-desc-p">Step-by-step clarity for your complete peace of mind.</p>
          </div>

          <div className="process-timeline-grid">
            {[
              { num: '01', title: 'Consultation', text: 'Understanding your family requirements, architectural preferences, and budget expectations.' },
              { num: '02', title: 'Site Evaluation', text: 'Comprehensive plot survey, soil testing, road access review, and municipal bylaws assessment.' },
              { num: '03', title: 'Architectural Design', text: 'Drafting custom 2D floor plans, 3D front elevation renders, and structural engineering designs.' },
              { num: '04', title: 'Detailed Estimate', text: 'Presenting a transparent Bill of Quantities (BOQ) with guaranteed brand specifications and fixed pricing.' },
              { num: '05', title: 'Agreement & Planning', text: 'Signing a binding contract detailing project milestones, timelines, and legal payment escrow terms.' },
              { num: '06', title: 'Construction Execution', text: 'End-to-end execution from deep foundation to RCC structure, masonry, MEP, and interior finishing.' },
              { num: '07', title: 'Quality Inspection', text: 'Rigorous 100+ point quality audits conducted by certified civil engineers at every critical milestone.' },
              { num: '08', title: 'Final Walkthrough', text: 'Joint customer inspection to review finishes and rectify any minor snags immediately.' },
              { num: '09', title: 'Ready-to-Move Handover', text: 'Delivering a spotless, ready-to-move home with all warranty certificates and utility approvals.' }
            ].map((step, idx) => (
              <div key={idx} className="process-card">
                <div className="process-num-badge">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="turnkey-section">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Why Partner With Us</span>
            <h2>Why Choose Our Turnkey Construction Service?</h2>
            <p className="section-desc-p">We eliminate the stress of traditional homebuilding with technology and professional project management.</p>
          </div>

          <div className="usp-grid">
            <div className="usp-card">
              <div className="usp-icon-wrap"><UserCheck /></div>
              <h4>Single Point of Contact</h4>
              <p>No need to chase separate contractors, electricians, plumbers, or material vendors. One dedicated manager handles everything.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap"><FileText /></div>
              <h4>Transparent Pricing</h4>
              <p>Fully defined scope and material costs before construction starts. Zero surprise expenses or price escalations.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap"><Award /></div>
              <h4>Certified Quality Materials</h4>
              <p>Direct factory sourcing of top brands (Tata Steel, UltraTech, Kajaria, Jaquar) with verified lab test reports.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap"><TrendingUp /></div>
              <h4>Dedicated Project Management</h4>
              <p>Full-time qualified site engineers and project directors ensuring structural integrity and precision craftsmanship.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap"><Clock /></div>
              <h4>Regular Progress Updates</h4>
              <p>Receive weekly HD photos, drone videos, and milestone progress reports delivered right to your phone.</p>
            </div>
            <div className="usp-card">
              <div className="usp-icon-wrap"><ShieldCheck /></div>
              <h4>Guaranteed Timeline & Warranty</h4>
              <p>Strict 8–12 month construction schedule backed by a 10-Year Structural Warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHAT IS INCLUDED */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Comprehensive Inclusions</span>
            <h2>“From Empty Plot to Finished Home — We Handle It All.”</h2>
            <p className="section-desc-p">Everything your new home needs is already included inside your turnkey contract.</p>
          </div>

          <div className="included-categories-grid">
            <div className="included-cat-box">
              <div className="included-cat-header">
                <Layers className="cat-hdr-icon" />
                <h3>1. Structure & Core</h3>
              </div>
              <ul className="included-list">
                <li><Check className="chk-icon" /> Soil testing & mechanized excavation</li>
                <li><Check className="chk-icon" /> Anti-termite foundation treatment</li>
                <li><Check className="chk-icon" /> RCC columns, plinth beams & footings</li>
                <li><Check className="chk-icon" /> Kiln-fired red bricks / AAC lightweight blocks</li>
                <li><Check className="chk-icon" /> Internal & external cement plastering</li>
                <li><Check className="chk-icon" /> Multi-layer terrace waterproofing</li>
              </ul>
            </div>

            <div className="included-cat-box">
              <div className="included-cat-header">
                <Zap className="cat-hdr-icon" />
                <h3>2. Electrical & Plumbing</h3>
              </div>
              <ul className="included-list">
                <li><Check className="chk-icon" /> Concealed FRLS copper house wiring</li>
                <li><Check className="chk-icon" /> Anchor Roma / Legrand modular switches</li>
                <li><Check className="chk-icon" /> Dedicated AC, geyser & inverter points</li>
                <li><Check className="chk-icon" /> Supreme SDR 11 CPVC hot & cold water piping</li>
                <li><Check className="chk-icon" /> Underground sump & overhead PVC water tank</li>
                <li><Check className="chk-icon" /> Complete drainage connected to municipal lines</li>
              </ul>
            </div>

            <div className="included-cat-box">
              <div className="included-cat-header">
                <PaintBucket className="cat-hdr-icon" />
                <h3>3. Finishing & Flooring</h3>
              </div>
              <ul className="included-list">
                <li><Check className="chk-icon" /> Double charged 4x2 / 2x2 vitrified tiles</li>
                <li><Check className="chk-icon" /> Natural polished granite for stairs & kitchen</li>
                <li><Check className="chk-icon" /> Anti-skid ceramic tiles for wet areas</li>
                <li><Check className="chk-icon" /> 2 coats acrylic putty + primer + Asian Paints Royale</li>
                <li><Check className="chk-icon" /> Weatherproof exterior emulsion coat</li>
                <li><Check className="chk-icon" /> Teak finish main entrance & flush internal doors</li>
              </ul>
            </div>

            <div className="included-cat-box">
              <div className="included-cat-header">
                <Droplet className="cat-hdr-icon" />
                <h3>4. Kitchen & Bathrooms</h3>
              </div>
              <ul className="included-list">
                <li><Check className="chk-icon" /> Custom modular kitchen with soft-close hardware</li>
                <li><Check className="chk-icon" /> Stainless steel sink with designer swivel faucet</li>
                <li><Check className="chk-icon" /> Jaquar / Hindware wall-hung toilet closets</li>
                <li><Check className="chk-icon" /> Chrome diverters, overhead shower & basin taps</li>
                <li><Check className="chk-icon" /> 7-ft designer glazed ceramic wall tiles</li>
                <li><Check className="chk-icon" /> Exhaust fan ventilation & geyser points</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MATERIALS & BRANDS TABLE */}
      <section className="turnkey-section">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Quality You Can Trust</span>
            <h2>Materials & Partner Brands</h2>
            <p className="section-desc-p">We only build with India's most trusted and certified construction brands.</p>
          </div>

          <div className="brand-spec-table-wrapper">
            <table className="turnkey-spec-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Essential Package</th>
                  <th>Premium Package (Recommended)</th>
                  <th>Luxury Package</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Cement</strong></td>
                  <td>CCI / Raasi 53 Grade OPC/PPC</td>
                  <td>UltraTech / ACC / Ambuja</td>
                  <td>UltraTech Super / Birla Gold</td>
                </tr>
                <tr>
                  <td><strong>TMT Steel</strong></td>
                  <td>Fe 500D Primary Steel</td>
                  <td>Tata Tiscon / Jindal Panther Fe 550D</td>
                  <td>Tata Tiscon Super Ductile 550D</td>
                </tr>
                <tr>
                  <td><strong>Tiles & Flooring</strong></td>
                  <td>Vitrified 2x2 ft (Somany/Orient)</td>
                  <td>Double Charged 4x2 ft (Kajaria/Nitco)</td>
                  <td>Italian Marble / Large Slabs (Kajaria)</td>
                </tr>
                <tr>
                  <td><strong>Electrical Wires</strong></td>
                  <td>Polycab / RR Kabel FRLS</td>
                  <td>Havells FRLS 100% Copper</td>
                  <td>Finolex / Havells Flame Guard</td>
                </tr>
                <tr>
                  <td><strong>Switches</strong></td>
                  <td>Anchor Penta / GM Modular</td>
                  <td>Anchor Roma / Legrand Arteor</td>
                  <td>Schneider AvatarOn / Smart Switches</td>
                </tr>
                <tr>
                  <td><strong>Plumbing Pipes</strong></td>
                  <td>Supreme / Astral CPVC</td>
                  <td>Supreme SDR 11 / Ashirvad</td>
                  <td>Astral Silencio / Supreme Heavy</td>
                </tr>
                <tr>
                  <td><strong>Paint & Putty</strong></td>
                  <td>Asian Paints Tractor Emulsion</td>
                  <td>Asian Paints Royale Luxury / Dulux</td>
                  <td>Asian Paints Royale Aspira + Textures</td>
                </tr>
                <tr>
                  <td><strong>Bath Fittings</strong></td>
                  <td>Cera / Hindware Standard</td>
                  <td>Jaquar Continental / Hindware Italian</td>
                  <td>Jaquar Artize / Kohler Luxury Series</td>
                </tr>
                <tr>
                  <td><strong>Doors & Windows</strong></td>
                  <td>Flush Doors & Aluminum Windows</td>
                  <td>Teak Finish Doors & UPVC Windows</td>
                  <td>Burma Teak Main Door & Soundproof UPVC</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. QUALITY ASSURANCE */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Quality Guarantee</span>
            <h2>Quality Assurance in Practice</h2>
            <p className="section-desc-p">
              Quality is a strict, measurable 5-stage engineering protocol verified on every site.
            </p>
          </div>

          <div className="qa-steps-row">
            <div className="qa-step-item">
              <div className="qa-badge-circle">1</div>
              <h4>Material Inspection</h4>
              <p>Factory test certificates verified before offloading steel, cement, and bricks on site.</p>
            </div>
            <div className="qa-arrow-sep">➔</div>

            <div className="qa-step-item">
              <div className="qa-badge-circle">2</div>
              <h4>Stage-wise QA Check</h4>
              <p>Column alignments, beam reinforcement, and formwork verified by structural engineers.</p>
            </div>
            <div className="qa-arrow-sep">➔</div>

            <div className="qa-step-item">
              <div className="qa-badge-circle">3</div>
              <h4>Cube & Slump Testing</h4>
              <p>Concrete compressive strength tested in certified labs at 7, 14, and 28-day intervals.</p>
            </div>
            <div className="qa-arrow-sep">➔</div>

            <div className="qa-step-item">
              <div className="qa-badge-circle">4</div>
              <h4>Snag Rectification</h4>
              <p>Thorough 100+ point pre-handover audit to catch and resolve micro-flaws before client review.</p>
            </div>
            <div className="qa-arrow-sep">➔</div>

            <div className="qa-step-item">
              <div className="qa-badge-circle">5</div>
              <h4>Certified Handover</h4>
              <p>Issuance of 10-Year structural warranty certificate and complete architectural drawing set.</p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button 
              type="button" 
              className="btn-turnkey-secondary"
              onClick={() => setShowChecklistModal(true)}
            >
              📋 View Our 100+ Point Quality Checklist
            </button>
          </div>
        </div>
      </section>

      {/* 9. PRICING / CONSTRUCTION PACKAGES */}
      <section id="turnkey-packages" className="turnkey-section">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Transparent Pricing</span>
            <h2>Construction Packages & Pricing</h2>
            <p className="section-desc-p">Choose the right package tailored for your plot size, architectural taste, and budget.</p>
          </div>

          <div className="turnkey-pricing-grid">
            {/* Essential Package */}
            <div className="turnkey-price-card">
              <div className="price-card-header">
                <h3>Essential Package</h3>
                <p>Standard quality construction for budget-conscious families.</p>
                <div className="price-rate">
                  <span className="currency">₹</span>
                  <span className="amount">1,650</span>
                  <span className="unit">/ sq.ft.</span>
                </div>
              </div>
              <ul className="price-features-list">
                <li><Check className="chk" /> Fe 500D TMT Steel & 53 Grade Cement</li>
                <li><Check className="chk" /> 9" Red Brick / 6" AAC Block Walls</li>
                <li><Check className="chk" /> 2x2 ft Vitrified Floor Tiles</li>
                <li><Check className="chk" /> Asian Paints Tractor Emulsion (Internal)</li>
                <li><Check className="chk" /> Polycab Wires & Anchor Penta Switches</li>
                <li><Check className="chk" /> Cera / Hindware Sanitary Fittings</li>
                <li><Check className="chk" /> Granite Kitchen Slab + SS Sink</li>
                <li><Check className="chk" /> Aluminum Powder-Coated Windows</li>
              </ul>
              <button 
                type="button" 
                className="btn-select-pkg"
                onClick={() => {
                  setFormData(prev => ({ ...prev, requirement: 'Essential Package (₹1,650/sq.ft)' }));
                  scrollToSection('turnkey-lead-form');
                }}
              >
                Choose Essential →
              </button>
            </div>

            {/* Premium Package (Highlighted) */}
            <div className="turnkey-price-card featured-pkg">
              <div className="popular-ribbon">MOST POPULAR</div>
              <div className="price-card-header">
                <h3>Premium Package</h3>
                <p>High-durability luxury finishes, designer modular kitchen & branded fittings.</p>
                <div className="price-rate">
                  <span className="currency">₹</span>
                  <span className="amount">1,950</span>
                  <span className="unit">/ sq.ft.</span>
                </div>
              </div>
              <ul className="price-features-list">
                <li><Check className="chk" /> <strong>Tata Tiscon / Jindal Fe 550D Steel</strong></li>
                <li><Check className="chk" /> <strong>UltraTech / ACC 53 Grade Cement</strong></li>
                <li><Check className="chk" /> <strong>4x2 ft Double Charged Kajaria Tiles</strong></li>
                <li><Check className="chk" /> <strong>Asian Paints Royale Luxury Emulsion</strong></li>
                <li><Check className="chk" /> <strong>Havells FRLS Wires & Anchor Roma Modular</strong></li>
                <li><Check className="chk" /> <strong>Jaquar Chrome Diverters & Wall Hung WC</strong></li>
                <li><Check className="chk" /> <strong>Full Modular Kitchen with Soft-Close</strong></li>
                <li><Check className="chk" /> <strong>Soundproof UPVC Windows & Teak Main Door</strong></li>
                <li><Check className="chk" /> <strong>Terrace Waterproofing + 10-Yr Warranty</strong></li>
              </ul>
              <button 
                type="button" 
                className="btn-turnkey-primary w-full"
                onClick={() => {
                  setFormData(prev => ({ ...prev, requirement: 'Premium Package (₹1,950/sq.ft)' }));
                  scrollToSection('turnkey-lead-form');
                }}
              >
                Choose Premium (Recommended) →
              </button>
            </div>

            {/* Luxury Package */}
            <div className="turnkey-price-card">
              <div className="price-card-header">
                <h3>Luxury Villa Package</h3>
                <p>Ultra-modern architectural villa with imported marble & smart home automation.</p>
                <div className="price-rate">
                  <span className="currency">₹</span>
                  <span className="amount">2,450</span>
                  <span className="unit">/ sq.ft.</span>
                </div>
              </div>
              <ul className="price-features-list">
                <li><Check className="chk" /> Tata Tiscon Super Ductile + UltraTech Super</li>
                <li><Check className="chk" /> Italian Marble Flooring in Living & Master</li>
                <li><Check className="chk" /> Smart Home Automation (Lights/Locks)</li>
                <li><Check className="chk" /> Asian Paints Royale Aspira + Designer Texture</li>
                <li><Check className="chk" /> Schneider AvatarOn Glass Modular Switches</li>
                <li><Check className="chk" /> Kohler / Jaquar Artize Luxury Bath Suites</li>
                <li><Check className="chk" /> Designer Acrylic Finish Island Modular Kitchen</li>
                <li><Check className="chk" /> Toughened Glass Balcony Railings & UPVC</li>
              </ul>
              <button 
                type="button" 
                className="btn-select-pkg"
                onClick={() => {
                  setFormData(prev => ({ ...prev, requirement: 'Luxury Villa Package (₹2,450/sq.ft)' }));
                  scrollToSection('turnkey-lead-form');
                }}
              >
                Choose Luxury →
              </button>
            </div>
          </div>

          {/* What Is NOT Included Section */}
          <div className="not-included-box">
            <div className="not-included-hdr">
              <ShieldCheck style={{ width: '22px', height: '22px', color: '#f97316' }} />
              <h4>100% Transparency: What is NOT Included?</h4>
            </div>
            <p className="not-included-desc">
              To keep our pricing completely crystal-clear and honest, the following third-party statutory items are billed directly at actuals:
            </p>
            <div className="not-included-tags">
              <span>✕ Municipal Plan Sanction / Government Liaisoning Fees</span>
              <span>✕ Electricity Board (EB) Meter & Connection Charges</span>
              <span>✕ Water Board (Jal Nigam) Meter Connection Deposit</span>
              <span>✕ Loose / Movable Furniture (Sofas, Beds, Dining Table)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CONSTRUCTION TIMELINE */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Timeline & Delivery</span>
            <h2>“How Long Will It Take to Build My Home?”</h2>
            <p className="section-desc-p">
              Typical Construction Timeline: <strong>8 to 12 Months*</strong> from site excavation to final key handover.
            </p>
          </div>

          <div className="timeline-stages-bar">
            {[
              { time: 'Month 1', stage: 'Design & Soil Prep', desc: 'Floor Plans, Soil Testing, Excavation' },
              { time: 'Month 2-3', stage: 'Foundation & Plinth', desc: 'Footings, Columns, Plinth Beams' },
              { time: 'Month 4-5', stage: 'RCC Slab & Structure', desc: 'Ground & Upper Floor Slab Casting' },
              { time: 'Month 6-7', stage: 'Brickwork & Plaster', desc: 'Masonry Walls, Internal & External Plaster' },
              { time: 'Month 8-9', stage: 'Electrical & Plumbing', desc: 'Concealed Wiring, Conduits & Piping' },
              { time: 'Month 10-11', stage: 'Flooring, Kitchen & Paint', desc: 'Tiles, Cabinets, Primers & Emulsion' },
              { time: 'Month 12', stage: 'Final Audit & Handover', desc: 'Deep Cleaning, Snag Rectification & Keys' }
            ].map((stg, idx) => (
              <div key={idx} className="timeline-stage-node">
                <div className="timeline-time-pill">{stg.time}</div>
                <div className="timeline-dot"></div>
                <h4 className="timeline-stage-name">{stg.stage}</h4>
                <p className="timeline-stage-sub">{stg.desc}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '20px' }}>
            *Timeline may vary slightly based on total built-up area (G+1 vs G+2) and municipal monsoon permissions.
          </p>
        </div>
      </section>

      {/* 11. COMPLETED PROJECTS SHOWCASE */}
      <section className="turnkey-section">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Real Proof</span>
            <h2>Our Completed Homes & Projects</h2>
            <p className="section-desc-p">Take a look at actual delivered homes built from scratch with our turnkey service.</p>
          </div>

          <div className="projects-showcase-grid">
            <div className="project-case-card">
              <img src="assets/turnkey_villa_luxury.jpg" alt="3BHK Contemporary Villa" className="case-img" />
              <div className="case-body">
                <div className="case-badge">Delivered on Time</div>
                <h3>3BHK Contemporary Villa</h3>
                <div className="case-specs-grid">
                  <div><strong>Location:</strong> Pune / PCMC</div>
                  <div><strong>Plot Size:</strong> 1,500 sq.ft.</div>
                  <div><strong>Built-up:</strong> 2,200 sq.ft. (G+1)</div>
                  <div><strong>Timeline:</strong> 9 Months</div>
                  <div><strong>Package:</strong> Premium</div>
                </div>
              </div>
            </div>

            <div className="project-case-card">
              <img src="assets/builder_project1.png" alt="4BHK Modern Residence" className="case-img" />
              <div className="case-body">
                <div className="case-badge">Luxury Finish</div>
                <h3>4BHK Modern Residence</h3>
                <div className="case-specs-grid">
                  <div><strong>Location:</strong> Bangalore North</div>
                  <div><strong>Plot Size:</strong> 2,400 sq.ft.</div>
                  <div><strong>Built-up:</strong> 3,600 sq.ft. (G+2)</div>
                  <div><strong>Timeline:</strong> 11 Months</div>
                  <div><strong>Package:</strong> Luxury Villa</div>
                </div>
              </div>
            </div>

            <div className="project-case-card">
              <img src="assets/builder_project3.png" alt="3BHK Duplex Independent Home" className="case-img" />
              <div className="case-body">
                <div className="case-badge">Budget Optimized</div>
                <h3>3BHK Duplex Independent Home</h3>
                <div className="case-specs-grid">
                  <div><strong>Location:</strong> Hyderabad Gachibowli</div>
                  <div><strong>Plot Size:</strong> 1,200 sq.ft.</div>
                  <div><strong>Built-up:</strong> 1,950 sq.ft.</div>
                  <div><strong>Timeline:</strong> 8.5 Months</div>
                  <div><strong>Package:</strong> Essential</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. CUSTOMER TESTIMONIALS */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Client Trust</span>
            <h2>What Homeowners Say About Us</h2>
            <p className="section-desc-p">Real experiences from families who trusted us with their dream home.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars-row">★★★★★</div>
              <p className="testi-quote">
                “I work in Mumbai while our residential plot was in Pune. I was genuinely anxious about remote construction management. Elder-o-Buddy's turnkey team managed everything from foundation casting to modular kitchen seamlessly. Weekly video updates were provided and the home was handed over 10 days ahead of schedule!”
              </p>
              <div className="testi-author">
                <div className="author-avatar">RK</div>
                <div>
                  <strong>Rajesh Kulkarni</strong>
                  <span>3BHK Villa, Pune (Delivered in 9 Mos)</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars-row">★★★★★</div>
              <p className="testi-quote">
                “The biggest differentiator was Zero Cost Escalation. The initial estimate and BOQ were strictly honored without a single hidden rupee. Tata Tiscon steel and UltraTech cement were delivered directly from authorized factories. 100% professional execution!”
              </p>
              <div className="testi-author">
                <div className="author-avatar">VS</div>
                <div>
                  <strong>Vikram & Shalini Sharma</strong>
                  <span>4BHK Duplex, Bangalore (Delivered in 11 Mos)</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars-row">★★★★★</div>
              <p className="testi-quote">
                “Local contractors were creating arbitrary weekly bills without transparency. Here, payments were tied to verified milestones inspected by structural engineers. The tiling, plumbing, and electrical finishing are immaculate. Highly recommended!”
              </p>
              <div className="testi-author">
                <div className="author-avatar">AM</div>
                <div>
                  <strong>Anil Mehta</strong>
                  <span>Independent Residence, Hyderabad (Delivered in 8.5 Mos)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. TRADITIONAL CONTRACTOR VS TURNKEY */}
      <section className="turnkey-section">
        <div className="container">
          <div className="section-header-center">
            <span className="sub-badge">Clear Comparison</span>
            <h2>Traditional Contractor vs. Turnkey Construction</h2>
            <p className="section-desc-p">See why smart homeowners are choosing turnkey construction over unorganized local contractors.</p>
          </div>

          <div className="comparison-table-wrapper">
            <table className="turnkey-compare-table">
              <thead>
                <tr>
                  <th>Parameters</th>
                  <th className="th-bad">Local Traditional Contractor</th>
                  <th className="th-good">Elder-o-Buddy Turnkey Construction</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Team & Coordination</strong></td>
                  <td className="bad-cell">✕ Multiple uncoordinated contractors, plumbers & electricians</td>
                  <td className="good-cell">✓ Single dedicated engineering team handling everything</td>
                </tr>
                <tr>
                  <td><strong>Cost Transparency</strong></td>
                  <td className="bad-cell">✕ Frequent cost escalations & hidden charges midway</td>
                  <td className="good-cell">✓ Guaranteed BOQ rate with legally binding fixed pricing</td>
                </tr>
                <tr>
                  <td><strong>Material Quality</strong></td>
                  <td className="bad-cell">✕ Uncertified local brands & mixed duplicate materials</td>
                  <td className="good-cell">✓ 100% factory-sourced Tier-1 brands (Tata, UltraTech, Jaquar)</td>
                </tr>
                <tr>
                  <td><strong>Daily Supervision</strong></td>
                  <td className="bad-cell">✕ Homeowner has to visit and supervise site daily</td>
                  <td className="good-cell">✓ Dedicated full-time site engineer with weekly video reports</td>
                </tr>
                <tr>
                  <td><strong>Delivery Timeline</strong></td>
                  <td className="bad-cell">✕ Months of recurring delays with constant excuses</td>
                  <td className="good-cell">✓ Strict 8–12 month milestone schedule with penalty clause</td>
                </tr>
                <tr>
                  <td><strong>Post-Handover Warranty</strong></td>
                  <td className="bad-cell">✕ Zero warranty; contractor is unreachable post-payment</td>
                  <td className="good-cell">✓ 10-Year Structural Warranty & 1-Year Free Maintenance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 14. FAQS ACCORDION */}
      <section className="turnkey-section bg-surface-alt">
        <div className="container" style={{ maxWidth: '940px' }}>
          <div className="section-header-center">
            <span className="sub-badge">Got Questions?</span>
            <h2>Frequently Asked Questions</h2>
            <p className="section-desc-p">Everything you need to know about our turnkey construction process, pricing, and quality guarantees.</p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="faq-category-pills">
            {[
              { key: 'all', label: 'All Questions', count: faqs.length },
              { key: 'process', label: 'Turnkey & Process', count: faqs.filter(f => f.category === 'process').length },
              { key: 'pricing', label: 'Cost & Pricing', count: faqs.filter(f => f.category === 'pricing').length },
              { key: 'materials', label: 'Materials & Quality', count: faqs.filter(f => f.category === 'materials').length },
              { key: 'timeline', label: 'Timeline & Warranty', count: faqs.filter(f => f.category === 'timeline').length }
            ].map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`faq-cat-pill-btn ${faqCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setFaqCategory(cat.key);
                  setOpenFaq(null);
                }}
              >
                <span>{cat.label}</span>
                <span className="faq-cat-count">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Live Search Filter Bar */}
          <div className="faq-search-box">
            <span className="faq-search-icon">🔍</span>
            <input 
              type="text"
              placeholder="Search questions (e.g. warranty, cost per sq.ft, steel brands, timeline)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="faq-search-input"
            />
            {faqSearch && (
              <button 
                type="button" 
                className="faq-search-clear"
                onClick={() => setFaqSearch('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* FAQ Items List */}
          <div className="turnkey-faq-accordion">
            {filteredFaqs.length === 0 ? (
              <div className="faq-no-results">
                <p>No matching questions found for "{faqSearch}".</p>
                <button type="button" className="btn-turnkey-secondary" onClick={() => setFaqSearch('')}>
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredFaqs.map((item, idx) => {
                const isOpen = openFaq === item.id;
                return (
                  <div key={item.id} className={`turnkey-faq-item ${isOpen ? 'active' : ''}`}>
                    <button 
                      type="button" 
                      className="faq-question-btn"
                      onClick={() => toggleFaq(item.id)}
                    >
                      <div className="faq-q-left">
                        <span className="faq-q-num">Q{item.id < 10 ? `0${item.id}` : item.id}</span>
                        <div className="faq-q-text-wrap">
                          <span className="faq-q-category-tag">{item.categoryLabel}</span>
                          <span className="faq-q-text">{item.q}</span>
                        </div>
                      </div>
                      <div className={`faq-toggle-circle ${isOpen ? 'open' : ''}`}>
                        {isOpen ? '−' : '+'}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-body animate-fade-in">
                        <div className="faq-answer-inner">
                          <p>{item.a}</p>
                          <div className="faq-answer-footer-tip">
                            <span className="tip-badge">✓ Verified Guarantee</span>
                            <span>Included in Elder-o-Buddy Turnkey Agreement</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Interactive Help & Consultation Banner */}
          <div className="faq-help-banner">
            <div className="faq-help-left">
              <div className="help-avatar-group">
                <span className="help-icon">👷‍♂️</span>
              </div>
              <div>
                <h4>Still have a specific question about your plot?</h4>
                <p>Our senior civil engineers and architects are available for a 1-on-1 consultation.</p>
              </div>
            </div>
            <div className="faq-help-right">
              <button 
                type="button" 
                className="btn-turnkey-primary"
                onClick={() => scrollToSection('turnkey-lead-form')}
              >
                Ask an Architect →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5 BIG CUSTOMER CONCERNS BANNER */}
      <section className="turnkey-section" style={{ background: '#0f172a', color: '#ffffff', padding: '50px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <span style={{ background: '#f97316', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
              Your 5 Biggest Questions — Answered
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '2rem', marginTop: '10px' }}>Key Homeowner Questions Answered With Complete Clarity</h2>
          </div>

          <div className="top5-concerns-grid">
            <div className="concern-card">
              <div className="concern-emoji">💰</div>
              <h4>1. What will be the cost?</h4>
              <p>Transparent ₹1,650–₹2,450/sq.ft. packages with pre-fixed BOQ rates and zero surprise costs.</p>
            </div>
            <div className="concern-card">
              <div className="concern-emoji">🧱</div>
              <h4>2. How is quality verified?</h4>
              <p>Only top certified brands (UltraTech, Tata Tiscon, Kajaria, Jaquar) with 5-stage lab testing.</p>
            </div>
            <div className="concern-card">
              <div className="concern-emoji">👷</div>
              <h4>3. Who is responsible?</h4>
              <p>A single dedicated project management team handles architecture to handover end-to-end.</p>
            </div>
            <div className="concern-card">
              <div className="concern-emoji">⏱️</div>
              <h4>4. When will it be ready?</h4>
              <p>Committed 8 to 12 months timeline with stage milestones and weekly video progress updates.</p>
            </div>
            <div className="concern-card">
              <div className="concern-emoji">🛡️</div>
              <h4>5. What if issues arise?</h4>
              <p>Comprehensive 10-Year Structural Warranty plus 1-Year Free Maintenance support guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. FINAL CTA & LEAD FORM */}
      <section id="turnkey-lead-form" className="turnkey-section" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="turnkey-form-card">
            <div className="form-card-header">
              <span className="turnkey-pill-badge">Start Today</span>
              <h2>Take the First Step Toward Your Dream Home Today</h2>
              <p>Fill out this form and our senior structural architect will contact you within 2 hours for a FREE consultation & site estimate.</p>
            </div>

            {submitSuccess ? (
              <div className="form-success-banner">
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#16a34a', margin: '0 auto 10px' }} />
                <h3>Thank You! Consultation Request Received.</h3>
                <p>Our senior structural architect will call you at <strong>{formData.phone}</strong> shortly to schedule your free site consultation.</p>
                <button 
                  type="button" 
                  className="btn-turnkey-primary"
                  onClick={() => setSubmitSuccess(false)}
                  style={{ marginTop: '15px' }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="turnkey-lead-form-grid">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="e.g. Rahul Sharma" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number (WhatsApp) *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="e.g. 9876543210" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>City / Plot Location *</label>
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="e.g. Pune, Bangalore, Delhi NCR, Hyderabad" 
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Plot Size (sq.ft / dimensions)</label>
                    <input 
                      type="text" 
                      name="plotSize" 
                      placeholder="e.g. 1500 sq.ft (30x50)" 
                      value={formData.plotSize}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Approx. Construction Budget</label>
                    <select name="budget" value={formData.budget} onChange={handleInputChange}>
                      <option value="">Select Budget Range</option>
                      <option value="₹25 Lakhs - ₹40 Lakhs">₹25 Lakhs - ₹40 Lakhs</option>
                      <option value="₹40 Lakhs - ₹60 Lakhs">₹40 Lakhs - ₹60 Lakhs</option>
                      <option value="₹60 Lakhs - ₹90 Lakhs">₹60 Lakhs - ₹90 Lakhs</option>
                      <option value="₹90 Lakhs - ₹1.5 Cr">₹90 Lakhs - ₹1.5 Cr</option>
                      <option value="₹1.5 Cr+">₹1.5 Cr+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Property Type</label>
                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange}>
                      <option value="Independent House">Independent House</option>
                      <option value="Luxury Villa">Luxury Villa</option>
                      <option value="Duplex Residence">Duplex Residence</option>
                      <option value="G+2 Multi-Story Floors">G+2 Multi-Story Floors</option>
                      <option value="Farmhouse">Farmhouse</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Construction Requirement</label>
                    <select name="requirement" value={formData.requirement} onChange={handleInputChange}>
                      <option value="Full Turnkey (Design to Handover)">Full Turnkey (Design to Handover)</option>
                      <option value="Premium Package (₹1,950/sq.ft)">Premium Package (₹1,950/sq.ft)</option>
                      <option value="Essential Package (₹1,650/sq.ft)">Essential Package (₹1,650/sq.ft)</option>
                      <option value="Luxury Villa Package (₹2,450/sq.ft)">Luxury Villa Package (₹2,450/sq.ft)</option>
                      <option value="Civil Structure Only">Civil Structure Only</option>
                      <option value="Complete Home Renovation">Complete Home Renovation</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Callback Time</label>
                    <select name="callbackTime" value={formData.callbackTime} onChange={handleInputChange}>
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                      <option value="Anytime">Anytime</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Additional Notes (Optional)</label>
                  <textarea 
                    name="message" 
                    rows="3" 
                    placeholder="Tell us about your requirements (e.g. number of bedrooms, Vastu preferences, target move-in date)..."
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn-turnkey-primary w-full"
                  disabled={submitting}
                  style={{ fontSize: '1rem', padding: '14px', marginTop: '10px' }}
                >
                  {submitting ? 'Submitting Request...' : 'Get Free Consultation & Site Estimate →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 100+ POINT QUALITY CHECKLIST MODAL */}
      {showChecklistModal && (
        <div className="modal-overlay active" onClick={() => setShowChecklistModal(false)}>
          <div className="modal-card checklist-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header checklist-modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800' }}>
                    📋 100+ Point Quality Checklist Overview
                  </h3>
                  <span className="checklist-points-badge">108 Rigorous Checkpoints</span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Standard operating engineering protocol enforced on every Elder-o-Buddy turnkey construction project.
                </p>
              </div>
              <button 
                type="button" 
                className="btn-close-modal" 
                onClick={() => setShowChecklistModal(false)}
                title="Close Modal"
              >
                ✕
              </button>
            </div>

            {/* Metric Trust Badges Bar */}
            <div className="checklist-stats-bar">
              <div className="stat-pill">
                <span className="pill-val">108</span>
                <span className="pill-txt">Mandatory Quality Gates</span>
              </div>
              <div className="stat-pill">
                <span className="pill-val">6</span>
                <span className="pill-txt">Critical Construction Stages</span>
              </div>
              <div className="stat-pill">
                <span className="pill-val">IS Codes</span>
                <span className="pill-txt">Bureau of Indian Standards</span>
              </div>
              <div className="stat-pill">
                <span className="pill-val">100%</span>
                <span className="pill-txt">Engineer Sign-Off Required</span>
              </div>
            </div>

            {/* Stage Selector Pills */}
            <div className="checklist-stage-tabs">
              {checklistStages.map((st) => (
                <button
                  key={st.key}
                  type="button"
                  className={`stage-tab-btn ${checklistStage === st.key ? 'active' : ''}`}
                  onClick={() => setChecklistStage(st.key)}
                >
                  <span>{st.label}</span>
                  <span className="stage-count-badge">{st.count}</span>
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="checklist-search-wrapper">
              <span className="chk-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search checklist items (e.g. concrete, ponding, megger, IS 456, tiles, curing)..."
                value={checklistSearch}
                onChange={(e) => setChecklistSearch(e.target.value)}
                className="checklist-search-input"
              />
              {checklistSearch && (
                <button 
                  type="button" 
                  className="checklist-search-clear"
                  onClick={() => setChecklistSearch('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Checklist Items Scrollable List */}
            <div className="modal-body checklist-modal-body">
              {filteredChecklist.length === 0 ? (
                <div className="checklist-empty-state">
                  <p>No quality checkpoints found matching "{checklistSearch}".</p>
                  <button type="button" className="btn-turnkey-secondary" onClick={() => setChecklistSearch('')}>
                    Reset Search Filter
                  </button>
                </div>
              ) : (
                <div className="checklist-cards-grid">
                  {filteredChecklist.map((item) => (
                    <div key={item.id} className="checklist-item-card animate-fade-in">
                      <div className="chk-card-top">
                        <div className="chk-left-meta">
                          <span className="chk-id-badge">{item.id}</span>
                          <span className="chk-stage-tag">{item.stageLabel}</span>
                        </div>
                        <span className="chk-standard-tag">{item.standard}</span>
                      </div>
                      <h4 className="chk-item-title">
                        <span className="chk-green-tick">✓</span> {item.title}
                      </h4>
                      <p className="chk-item-desc">{item.desc}</p>
                      <div className="chk-status-strip">
                        <span className="chk-pass-indicator">● Mandatory QA Sign-Off</span>
                        <span className="chk-cert-note">Checked by Site Structural Engineer</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer checklist-modal-footer">
              <div className="chk-footer-info">
                <span>Showing <strong>{filteredChecklist.length}</strong> of <strong>108</strong> quality checkpoints</span>
              </div>
              <div className="chk-footer-actions">
                <button 
                  type="button" 
                  className="btn-turnkey-secondary"
                  onClick={() => setShowChecklistModal(false)}
                >
                  Close Checklist
                </button>
                <button 
                  type="button" 
                  className="btn-turnkey-primary"
                  onClick={() => {
                    setShowChecklistModal(false);
                    scrollToSection('turnkey-lead-form');
                  }}
                >
                  Request QA Protocol Sample →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
